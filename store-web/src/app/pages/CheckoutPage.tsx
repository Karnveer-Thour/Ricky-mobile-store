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

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, clearCart, setTrackedOrderId, products, user } = useApp();

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

  // OTP Verification state
  const [otp, setOtp] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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

  const handleVerifyOtpAndSubmit = () => {
    if (otp !== "1234") {
      alert("Invalid OTP! Hint: Use 1234");
      return;
    }

    // Process Order
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      setShowOtpVerification(false);
      setOrderPlaced(true);
      clearCart();

      const simulatedOrderId =
        "RMS-" + Math.floor(Math.random() * 900000 + 100000);
      setTrackedOrderId(simulatedOrderId);

      // Save real placed order to localStorage
      try {
        const existingOrders = JSON.parse(
          localStorage.getItem("placedOrders") || "[]",
        );
        const orderRecord = {
          id: simulatedOrderId,
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
        navigate(`/orders/${simulatedOrderId}/track`);
      }, 2000);
    }, 1500);
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
                  setName={setName}
                  mobile={mobile}
                  setMobile={setMobile}
                  pincode={pincode}
                  setPincode={setPincode}
                  street={street}
                  setStreet={setStreet}
                  landmark={landmark}
                  setLandmark={setLandmark}
                  onContinue={() => setCheckoutStep(2)}
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
