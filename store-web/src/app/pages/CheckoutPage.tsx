import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useApp } from "../AppContext";
import { CartItem } from "../data";
import { ArrowLeft } from "lucide-react";
import {
  CheckoutStepIndicator,
  CheckoutAddressStep,
  CheckoutPaymentStep,
  CheckoutReviewStep,
  CheckoutOrderSummary,
  CheckoutSuccessView,
  CheckoutOtpModal,
} from "../components/checkout";
import { useToast } from "../hooks/useToast";
import { apiService } from "../services/apiService";
import { evaluatePincode } from "../components/DeliveryChecker";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, clearCart, setTrackedOrderId, products, user } = useApp();
  const toast = useToast();

  const [checkoutStep, setCheckoutStep] = useState(1);
  const [payMethod, setPayMethod] = useState("UPI");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Address form states
  const [street, setStreet] = useState("G.T. Road, Near Bus Stand");
  const [pincode, setPincode] = useState(() => {
    try {
      return typeof window !== "undefined"
        ? localStorage.getItem("rms_pincode") || "141401"
        : "141401";
    } catch {
      return "141401";
    }
  });
  const [landmark, setLandmark] = useState("Near Khanna Old City Gate");
  const [mobile, setMobile] = useState(user?.mobileNumber || "+91 98765 43210");
  const [name, setName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : "Ricky Sharma",
  );

  const [otp, setOtp] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleAddressContinue = (data: {
    name: string;
    mobile: string;
    pincode: string;
    street: string;
    landmark: string;
  }) => {
    const cleanPin = (data.pincode || "").trim().replace(/\D/g, "");
    const dInfo = evaluatePincode(cleanPin);
    if (!dInfo.isDeliverable) {
      toast.delivery.unserviceable(cleanPin || "selected");
      return;
    }
    setName(data.name);
    setMobile(data.mobile);
    setPincode(data.pincode);
    setStreet(data.street);
    setLandmark(data.landmark);
    setCheckoutStep(2);
  };

  // Handle URL parameters for EMI pre-fill
  const lenderParam = searchParams.get("lender");
  const tenureParam = searchParams.get("tenure");
  const productIdParam = searchParams.get("product");
  const colorIdParam = searchParams.get("color");
  const qtyParam = searchParams.get("qty");

  // Local checkout items (defaults to cart, or URL pre-filled item)
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (productIdParam && colorIdParam) {
      const pid = productIdParam;
      const cid = colorIdParam;
      const qty = parseInt(qtyParam || "1");
      const p = products.find((pr) => String(pr.id) === String(pid));
      if (p) {
        const color = p.colors
          ? p.colors.find((c: any) => String(c.id) === String(cid))
          : null;
        setCheckoutItems([
          {
            productId: pid as any,
            colorId: cid as any,
            colorName: color ? color.colorName : "Default",
            qty,
          },
        ]);
        if (lenderParam) {
          setPayMethod(
            lenderParam === "bajaj" ? "EMI_BAJAJ" : "EMI_HOMECREDIT",
          );
        }
        return;
      }
    }
    setCheckoutItems(cart);
  }, [products, cart, productIdParam, colorIdParam, qtyParam, lenderParam]);

  const itemsTotal = checkoutItems.reduce((sum, item) => {
    const p = products.find((pr) => String(pr.id) === String(item.productId));
    return sum + (p ? (p.price - p.discount) * item.qty : 0);
  }, 0);

  const handlePlaceOrder = () => {
    // Trigger SMS OTP verification step first
    setShowOtpVerification(true);
  };

  const handleVerifyOtpAndSubmit = async () => {
    if (otp !== "1234") {
      toast.order.otpInvalid();
      return;
    }

    toast.order.otpSuccess();

    // Process Order
    setIsVerifyingOtp(true);
    let realOrderId = "RMS-" + Math.floor(Math.random() * 900000 + 100000);

    try {
      if (user?.id && !user.id.startsWith("u-demo-")) {
        const orderRes = await apiService.createOrder({
          buyerId: user.id,
          items: checkoutItems.map((item) => {
            const p = products.find(
              (pr) => String(pr.id) === String(item.productId),
            );
            return {
              productId: String(item.productId),
              colorId: item.colorId ? String(item.colorId) : undefined,
              quantity: item.qty,
              price: p ? p.price : 0,
              discount: p ? p.discount : 0,
            };
          }),
          lender: lenderParam || undefined,
          tenureMonths: tenureParam ? parseInt(tenureParam, 10) : undefined,
          landmark,
          deliveryOtp: otp,
          payMethod,
        });

        if (orderRes.status && orderRes.data?.id) {
          realOrderId = orderRes.data.id;
        }

        // Optionally save shipping address to backend delivery-address API
        apiService
          .createDeliveryAddress({
            customerId: user.id,
            houseNumber: "House",
            streetNumber: street.slice(0, 25),
            areaName: landmark || "Khanna Area",
            city: "Khanna",
            pincode: parseInt(pincode.replace(/\D/g, "") || "141401", 10),
            district: "Ludhiana",
            state: "Punjab",
            mobileNumber: mobile,
            label: "Home",
            isDefault: true,
          })
          .catch((err) =>
            console.warn("Failed to persist delivery address:", err),
          );
      }
    } catch (err) {
      console.warn("Backend order creation error, falling back:", err);
    } finally {
      setIsVerifyingOtp(false);
      setShowOtpVerification(false);
      setOrderPlaced(true);
      clearCart();

      setTrackedOrderId(realOrderId);
      toast.order.placed(realOrderId);

      // Save order to localStorage for immediate UI continuity
      try {
        const existingOrders = JSON.parse(
          localStorage.getItem("placedOrders") || "[]",
        );
        const orderRecord = {
          id: realOrderId,
          status: "PENDING",
          items: checkoutItems.map((item) => {
            const p = products.find(
              (pr) => String(pr.id) === String(item.productId),
            );
            return {
              name: p ? p.name : "Product Item",
              color: item.colorName,
              qty: item.qty,
              price: p ? p.price - p.discount : 0,
            };
          }),
          total: itemsTotal,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          payment: payMethod,
          landmark,
          pin_code: pincode,
        };
        localStorage.setItem(
          "placedOrders",
          JSON.stringify([orderRecord, ...existingOrders]),
        );
      } catch (err) {
        console.error("Failed to save placed order:", err);
      }

      setTimeout(() => {
        setOrderPlaced(false);
        navigate(`/orders/${realOrderId}/track`);
      }, 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-white transition-all mb-8 text-sm cursor-pointer"
      >
        <ArrowLeft size={15} /> Continue Shopping
      </button>

      {orderPlaced ? (
        <CheckoutSuccessView />
      ) : showOtpVerification ? (
        <CheckoutOtpModal
          mobile={mobile}
          otp={otp}
          setOtp={setOtp}
          isVerifyingOtp={isVerifyingOtp}
          onCancel={() => setShowOtpVerification(false)}
          onVerify={handleVerifyOtpAndSubmit}
        />
      ) : (
        <>
          <h1
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            className="text-4xl font-extrabold text-white tracking-widest mb-8"
          >
            CHECKOUT
          </h1>

          {/* Step indicator */}
          <CheckoutStepIndicator
            checkoutStep={checkoutStep}
            onStepClick={setCheckoutStep}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Address & Landmark Form */}
              {checkoutStep === 1 && (
                <CheckoutAddressStep
                  name={name}
                  mobile={mobile}
                  pincode={pincode}
                  street={street}
                  landmark={landmark}
                  onContinue={handleAddressContinue}
                />
              )}

              {/* Step 2: Payment Method */}
              {checkoutStep === 2 && (
                <CheckoutPaymentStep
                  payMethod={payMethod}
                  setPayMethod={setPayMethod}
                  itemsTotal={itemsTotal}
                  tenureParam={tenureParam}
                  onBack={() => setCheckoutStep(1)}
                  onContinue={() => setCheckoutStep(3)}
                />
              )}

              {/* Step 3: Review Order */}
              {checkoutStep === 3 && (
                <CheckoutReviewStep
                  checkoutItems={checkoutItems}
                  products={products}
                  itemsTotal={itemsTotal}
                  street={street}
                  landmark={landmark}
                  pincode={pincode}
                  payMethod={payMethod}
                  onBack={() => setCheckoutStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </div>

            {/* Sidebar summary */}
            <CheckoutOrderSummary
              checkoutItems={checkoutItems}
              products={products}
              itemsTotal={itemsTotal}
            />
          </div>
        </>
      )}
    </div>
  );
}
