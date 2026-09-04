"use client";

import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import BankAccount from "../components/account";
import React, { useState } from "react";
import Button from "@/components/Button";
import { usePathname, useRouter } from "next/navigation";

const dummyTransactions = [
  {
    id: "TXN001",
    name: "Amit Sharma",
    accountNumber: "1234567890",
    amount: "₹10,000",
    date: "2025-07-01",
    status: "Success",
  },
  {
    id: "TXN002",
    name: "Priya Mehta",
    accountNumber: "9876543210",
    amount: "₹5,200",
    date: "2025-07-03",
    status: "Pending",
  },
  {
    id: "TXN003",
    name: "Raj Singh",
    accountNumber: "1111222233",
    amount: "₹7,800",
    date: "2025-07-05",
    status: "Failed",
  },
  {
    id: "TXN004",
    name: "Nikita Rao",
    accountNumber: "4444555566",
    amount: "₹3,450",
    date: "2025-07-07",
    status: "Success",
  },
];

function Page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [currentPage, setCurrentPage] = useState(1);
  const pathName = usePathname();
  const router = useRouter();
  const itemsPerPage = 10;

  const totalPages = Math.ceil(dummyTransactions.length / itemsPerPage);
  const currentData = dummyTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="w-full sm:px-8 space-y-8 overflow-hidden">
      {/* Heading */}
      <div className={`flex items-center gap-4 border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <h1
          className={`text-2xl sm:text-3xl font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Banking & Transactions
        </h1>
        <hr className={`flex-1 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`} />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Connected Bank Accounts</h2>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manage payout and settlement accounts for store disbursements</p>
        </div>
        <Button
          isDark={isDark}
          name={"Add New Bank Account"}
          handler={() => router.push(`${pathName}/add`)}
        />
      </div>

      {/* Bank Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BankAccount
          bankName="HDFC Bank"
          accountNumber="1234567890"
          ifscCode="HDFC0001234"
          value="hdfc"
          selected={true}
          onChange={(e) => e.target.value}
        />
        <BankAccount
          bankName="SBI Bank"
          accountNumber="9876543210"
          ifscCode="SBIN0009876"
          value="sbi"
          selected={false}
          onChange={(e) => e.target.value}
        />
      </div>

      {/* Transaction Table Section */}
      <div className="space-y-4 pt-4">
        <div className={`flex items-center gap-4 border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
          <h2
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Settlement & Transaction History
          </h2>
          <hr className={`flex-1 border-t ${isDark ? "border-slate-800" : "border-slate-200"}`} />
        </div>

        <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className={isDark ? "bg-slate-800/80 text-slate-300 border-b border-slate-700/80" : "bg-slate-50 text-slate-700 border-b border-slate-200"}>
                  <th className="py-3 px-4 text-left font-bold">Transaction ID</th>
                  <th className="py-3 px-4 text-left font-bold">Beneficiary</th>
                  <th className="py-3 px-4 text-left font-bold">Account No.</th>
                  <th className="py-3 px-4 text-left font-bold">Amount</th>
                  <th className="py-3 px-4 text-left font-bold">Date</th>
                  <th className="py-3 px-4 text-center font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentData.map((txn) => (
                  <tr
                    key={txn.id}
                    className={`cursor-pointer transition-colors ${
                      isDark
                        ? "hover:bg-slate-800/50 text-slate-200"
                        : "hover:bg-slate-50/80 text-slate-800"
                    }`}
                    onClick={() => router.push(`${pathName}/transaction`)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">{txn.id}</td>
                    <td className="py-3 px-4 font-medium">{txn.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{txn.accountNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{txn.amount}</td>
                    <td className="py-3 px-4 text-slate-500">{txn.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        txn.status === "Success"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30"
                          : txn.status === "Pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30"
                          : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30"
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className={`flex items-center justify-between px-4 py-3 border-t ${
            isDark ? "border-slate-800 bg-slate-900/30 text-slate-400" : "border-slate-200 bg-slate-50/50 text-slate-600"
          }`}>
            <span className="text-xs">Showing page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed text-slate-400"
                    : isDark
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-xs"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed text-slate-400"
                    : isDark
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-xs"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
