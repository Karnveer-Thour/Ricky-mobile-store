"use client";

import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import React from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { X } from "lucide-react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const transaction = {
  id: "TXN001",
  product: "Bluetooth Headphones",
  amount: "₹2,999",
  ifsc: "HDFC0001234",
  accountNumber: "1234567890",
  description: "Online payment via UPI",
  date: "2025-07-05",
  status: "Success",
};

const SingleTransactionPage = () => {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const router = useRouter();

  return (
    <BlurredPopupLayout isDark={isDark} width="35%" height="auto">
      <div className="flex top-0 right-0 w-full h-10 justify-end">
        <div className="flex items-center justify-center w-[15%] p-2">
          <Button
            name={<X size={24} />}
            handler={() => {
              router.back();
            }}
          />
        </div>
      </div>

      {/* Add flex container to align to right */}
      <div className="w-full flex justify-end">
        <div className="w-full max-w-2xl p-6 rounded-xl shadow-md border border-gray-300">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Transaction Details
          </h1>

          <div className="space-y-4 text-base">
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID:</span>
              <span>{transaction.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Product:</span>
              <span>{transaction.product}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>{transaction.amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">IFSC Code:</span>
              <span>{transaction.ifsc}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Account Number:</span>
              <span>{transaction.accountNumber}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Description:</span>
              <span>{transaction.description}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{transaction.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span
                className={`font-semibold ${
                  transaction.status === "Success"
                    ? "text-green-500"
                    : transaction.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BlurredPopupLayout>
  );
};

export default SingleTransactionPage;
