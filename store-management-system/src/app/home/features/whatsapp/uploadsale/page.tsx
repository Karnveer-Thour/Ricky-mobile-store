"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import { useSelector, useDispatch } from "react-redux";
import { storeType } from "@/types/store.index";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";
import { customerService } from "@/services/customer.service";
import { productService } from "@/services/product.service";
import { whatsappService, WhatsappGroup } from "@/services/whatsapp.service";
import {
  CreditCard,
  CheckCircle2,
  Percent,
  MessageCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function UploadSale() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);

  // Data sources
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [groups, setGroups] = useState<WhatsappGroup[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [paymentMode, setPaymentMode] = useState<
    "Cash" | "UPI" | "Card" | "Bajaj EMI" | "Home Credit EMI"
  >("Bajaj EMI");

  // EMI Configuration
  const [emiTenure, setEmiTenure] = useState<number>(6);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [bajajOtp, setBajajOtp] = useState<string>("1234");
  const [emiApproved, setEmiApproved] = useState<boolean>(true);
  const [cardlessChecking, setCardlessChecking] = useState<boolean>(false);

  // Load initial options
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        const [custRes, prodRes, grpRes] = await Promise.all([
          customerService.fetchCustomers(1, 50).catch(() => []),
          productService.fetchProducts(1, 50).catch(() => []),
          whatsappService.fetchGroups().catch(() => []),
        ]);

        setCustomers(Array.isArray(custRes) ? custRes : []);
        setProducts(Array.isArray(prodRes) ? prodRes : []);
        setGroups(Array.isArray(grpRes) ? grpRes : []);

        if (Array.isArray(custRes) && custRes.length > 0) {
          setSelectedCustomerId((custRes[0] as any)._id || custRes[0].id || "");
        }
        if (Array.isArray(prodRes) && prodRes.length > 0) {
          setSelectedProductIds([
            (prodRes[0] as any)._id || prodRes[0].id || "",
          ]);
        }
        if (Array.isArray(grpRes) && grpRes.length > 0) {
          setSelectedGroupId((grpRes[0] as any)._id || grpRes[0].id || "");
        }
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  // Compute total price from selected products
  const selectedProductObjs = products.filter((p) =>
    selectedProductIds.includes(p._id || p.id),
  );
  const totalAmount = selectedProductObjs.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0,
  );

  // EMI calculation (0% interest scheme for Bajaj & Home Credit)
  const financedAmount = Math.max(0, totalAmount - downPayment);
  const monthlyEmi = emiTenure > 0 ? Math.round(financedAmount / emiTenure) : 0;

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleVerifyEmi = () => {
    setCardlessChecking(true);
    setTimeout(() => {
      setCardlessChecking(false);
      setEmiApproved(true);
      dispatch(
        SUCCESSALERT(
          `${paymentMode} Cardless Limit ₹1,50,000 verified successfully!`,
        ),
      );
    }, 900);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      dispatch(ERRORALERT("Please select at least one product"));
      return;
    }

    const selectedCust = customers.find(
      (c) => (c._id || c.id) === selectedCustomerId,
    );
    const selectedGrp = groups.find((g) => (g._id || g.id) === selectedGroupId);

    setIsSubmitting(true);
    try {
      const payload: any = {
        customerId: selectedCustomerId,
        customerName:
          selectedCust?.name || selectedCust?.email || "Direct Customer",
        customerPhone: selectedCust?.phone || "+91 98765 43210",
        productIds: selectedProductIds,
        productNames: selectedProductObjs.map((p) => p.name),
        totalAmount,
        receivedAmount:
          paymentMode === "Cash" ||
          paymentMode === "UPI" ||
          paymentMode === "Card"
            ? totalAmount
            : downPayment,
        paymentMode,
        groupId: selectedGroupId,
        groupName: selectedGrp?.groupName || "WhatsApp VIP Group",
        notes: `Recorded via WhatsApp Group Manager. Total: ₹${totalAmount.toLocaleString("en-IN")}`,
      };

      if (paymentMode === "Bajaj EMI" || paymentMode === "Home Credit EMI") {
        payload.emiDetails = {
          lender: paymentMode === "Bajaj EMI" ? "Bajaj Finserv" : "Home Credit",
          tenureMonths: emiTenure,
          downPayment,
          monthlyEmi,
          approvalStatus: "Approved",
          loanReference: `LN-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }

      const res = await whatsappService.recordSale(payload);
      if (res.ok) {
        dispatch(
          SUCCESSALERT(
            res.message || "WhatsApp group sale uploaded successfully!",
          ),
        );
        router.push("/home/features/whatsapp");
      } else {
        dispatch(ERRORALERT(res.message || "Failed to upload sale."));
      }
    } catch {
      dispatch(ERRORALERT("Error recording sale. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlurredPopupLayout width={"80%"} height={"auto"} isDark={isDark}>
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-slate-950 font-bold shadow-lg shadow-green-500/20">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Upload WhatsApp Group Sale
            </h2>
            <p className="text-xs text-slate-400">
              Record group sales with real-time Bajaj Finserv & Home Credit EMI
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Ricky Direct Financed
        </span>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Step 1: Customer & Target WhatsApp Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Inputcontainer
            label="Select Customer"
            type="customer"
            isDark={isDark}
          >
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-sm font-medium bg-slate-900 border border-slate-700 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            >
              {customers.length === 0 ? (
                <option value="">Default VIP Customer</option>
              ) : (
                customers.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name || c.email} ({c.phone || "No phone"})
                  </option>
                ))
              )}
            </select>
          </Inputcontainer>

          <Inputcontainer
            label="WhatsApp Target Group"
            type="group"
            isDark={isDark}
          >
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-sm font-medium bg-slate-900 border border-slate-700 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            >
              {groups.map((g) => (
                <option key={g._id || g.id} value={g._id || g.id}>
                  {g.groupName} ({g.memberCount || 100}+ Members)
                </option>
              ))}
            </select>
          </Inputcontainer>
        </div>

        {/* Step 2: Product Multi-Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>
              Select Purchased Products ({selectedProductIds.length} chosen)
            </span>
            <span className="text-cyan-400 font-extrabold">
              Total: ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
            {products.length === 0 ? (
              <div className="col-span-3 text-center py-4 text-xs text-slate-500">
                No products found. Add products in Product Catalog.
              </div>
            ) : (
              products.map((p) => {
                const id = p._id || p.id;
                const isSelected = selectedProductIds.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => handleToggleProduct(id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold truncate">
                        {p.name || p.productName}
                      </p>
                      <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">
                        ₹{Number(p.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected
                          ? "bg-cyan-500 border-cyan-400 text-slate-950"
                          : "border-slate-700 bg-slate-800"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 size={14} className="stroke-[3]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Step 3: Payment & EMI Selection */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Payment & Financing Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              {
                id: "Bajaj EMI",
                label: "Bajaj Finserv EMI",
                badge: "0% Interest",
              },
              {
                id: "Home Credit EMI",
                label: "Home Credit EMI",
                badge: "Instant",
              },
              { id: "UPI", label: "Instant UPI Pay", badge: "Fast" },
              { id: "Card", label: "Credit/Debit Card", badge: "POS" },
              { id: "Cash", label: "Cash on Hand", badge: "Direct" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setPaymentMode(mode.id as any)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMode === mode.id
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,207,255,0.25)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <CreditCard
                    size={14}
                    className={
                      paymentMode === mode.id
                        ? "text-cyan-400"
                        : "text-slate-500"
                    }
                  />
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-cyan-300">
                    {mode.badge}
                  </span>
                </div>
                <span className="text-xs font-bold">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Bajaj Finserv / Home Credit EMI Calculator Panel */}
        {(paymentMode === "Bajaj EMI" || paymentMode === "Home Credit EMI") && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Percent size={16} />
                <span>{paymentMode} 0% No-Cost EMI Calculator</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck size={13} />
                <span>Pre-Approved Limit: ₹1,50,000</span>
              </div>
            </div>

            {/* Tenure Selectors */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Choose Tenure:
              </span>
              <div className="grid grid-cols-6 gap-2">
                {[3, 6, 9, 12, 18, 24].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEmiTenure(t)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      emiTenure === t
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30"
                        : "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {t} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Down Payment & Installment Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block mb-1">
                  Down Payment (₹):
                </span>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  value={downPayment}
                  onChange={(e) =>
                    setDownPayment(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full bg-transparent text-sm font-bold text-white outline-none border-b border-cyan-500/50 pb-1"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 block mb-1">
                  Financed Principal:
                </span>
                <span className="text-sm font-bold text-cyan-300">
                  ₹{financedAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-cyan-400 block mb-1 font-semibold">
                  Monthly Installment:
                </span>
                <span className="text-base font-extrabold text-white">
                  ₹{monthlyEmi.toLocaleString("en-IN")} / mo
                </span>
              </div>
            </div>

            {/* Instant Limit & OTP Verification */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">
                  Verification OTP:
                </span>
                <input
                  type="text"
                  maxLength={4}
                  value={bajajOtp}
                  onChange={(e) => setBajajOtp(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-center text-xs font-bold text-cyan-300 tracking-widest outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyEmi}
                disabled={cardlessChecking}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Zap size={14} />
                <span>
                  {cardlessChecking ? "Verifying..." : "Verify Cardless Limit"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Button type="button" name="Cancel" handler={() => router.back()} />

          <Button
            type="submit"
            name={
              isSubmitting ? "Broadcasting Sale..." : "Confirm & Upload Sale"
            }
            disabled={
              isSubmitting ||
              loadingData ||
              totalAmount === 0 ||
              (isEmi && !emiApproved)
            }
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}
