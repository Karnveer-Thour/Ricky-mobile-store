import React from "react";

interface CheckoutOtpModalProps {
  mobile: string;
  otp: string;
  setOtp: (val: string) => void;
  isVerifyingOtp: boolean;
  onCancel: () => void;
  onVerify: () => void;
}

export default function CheckoutOtpModal({
  mobile,
  otp,
  setOtp,
  isVerifyingOtp,
  onCancel,
  onVerify,
}: CheckoutOtpModalProps) {
  return (
    <div className="max-w-md mx-auto p-6 bg-[#0e0e1c] border border-white/10 rounded-3xl text-center space-y-6">
      <h2
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        className="text-3xl font-extrabold text-white tracking-widest"
      >
        VERIFY MOBILE OTP
      </h2>
      <p className="text-sm text-gray-600">
        We've sent a 4-digit code to {mobile}. Please enter it to authorize this
        transaction.
      </p>

      <input
        type="text"
        pattern="[0-9]*"
        maxLength={4}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP (e.g. 1234)"
        className="w-full text-center tracking-widest text-2xl font-bold bg-white/4 border border-white/8 rounded-xl py-3 text-white focus:outline-none focus:border-[#00cfff]/40"
      />

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border border-white/8 text-gray-500 font-semibold rounded-2xl hover:bg-white/4 transition-all text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onVerify}
          disabled={isVerifyingOtp || otp.length < 4}
          className="flex-1 py-3 bg-green-500 text-white font-extrabold rounded-2xl hover:bg-green-400 transition-all text-sm cursor-pointer disabled:opacity-40"
        >
          {isVerifyingOtp ? "Verifying..." : "CONFIRM ORDER"}
        </button>
      </div>
    </div>
  );
}
