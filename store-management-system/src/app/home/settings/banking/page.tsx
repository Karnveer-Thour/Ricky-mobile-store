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
    <>
      {/* Heading */}
      <div className="w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p
          className={`text-3xl font-semibold ${
            isDark ? "text-white" : "text-gray-700"
          }`}
        >
          Banking and Transactions
        </p>
        <hr
          className={`border-t-3 ${
            isDark ? "text-gray-100" : "text-gray-700"
          } mt-1 flex-1`}
        />
      </div>

      <div className="w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <Button
          name={"Add New Bank Account"}
          className="w-48"
          handler={() => router.push(`${pathName}/add`)}
        />
      </div>

      {/* Bank Accounts */}
      <div className="w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
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

      {/* Transaction Table */}
      <div className="w-[93%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <hr
          className={`border-t-3 ${
            isDark ? "text-gray-100" : "text-gray-700"
          } mt-1 flex-1`}
        />
        <p
          className={`text-3xl font-semibold ${
            isDark ? "text-white" : "text-gray-700"
          }`}
        >
          Banking and Transactions
        </p>
        <hr
          className={`border-t-3 ${
            isDark ? "text-gray-100" : "text-gray-700"
          } mt-1 flex-1`}
        />
      </div>
      <div className="w-[93%] sm:ms-10 me-9 mt-12 max-sm:ms-4 h-auto">
        <div className="overflow-x-auto">
          <table
            className={`min-w-full text-sm border ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            <thead>
              <tr
                className={`bg-gray-200 ${
                  isDark ? "bg-gray-700 text-white" : ""
                }`}
              >
                <th className="p-2 border">Transaction ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Account No.</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((txn) => (
                <tr
                  key={txn.id}
                  className={`${
                    isDark ? "bg-gray-800" : "bg-white"
                  } hover:bg-gray-100 transition`}
                  onClick={() => router.push(`${pathName}/transaction`)}
                >
                  <td className="p-2 border text-center">{txn.id}</td>
                  <td className="p-2 border text-center">{txn.name}</td>
                  <td className="p-2 border text-center">
                    {txn.accountNumber}
                  </td>
                  <td className="p-2 border text-center">{txn.amount}</td>
                  <td className="p-2 border text-center">{txn.date}</td>
                  <td className="p-2 border text-center">{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Page;
