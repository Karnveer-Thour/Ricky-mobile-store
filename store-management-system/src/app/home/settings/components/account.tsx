import Button from "@/components/Button";
import { Trash } from "lucide-react";
import React from "react";
import Delete from "../banking/components/Delete";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

interface BankAccountProps {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  value: string;
  selected?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BankAccount = ({
  bankName,
  accountNumber,
  ifscCode,
  value,
  selected = false,
  onChange,
}: BankAccountProps) => {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [isDeleting, setIsDeleting] = React.useState(false);
  if (isDeleting) {
    return (
      <Delete
        Name={bankName}
        Id={accountNumber}
        isDark={isDark}
        handleDelete={() => setIsDeleting(false)}
      />
    );
  }
  return (
    <label
      className={`w-full border rounded-2xl p-5 cursor-pointer flex gap-4 items-center justify-between transition-all duration-200 ${
        selected
          ? isDark
            ? "bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10"
            : "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-500"
          : isDark
            ? "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300"
            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs"
      }`}
    >
      {/* Native radio input */}
      <input
        type="radio"
        name="bankAccount"
        value={value}
        checked={selected}
        onChange={onChange}
        className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
      />

      <div className="flex flex-col flex-grow ms-2">
        <p
          className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {bankName}
        </p>
        <div
          className={`text-xs mt-1 space-y-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          <p>
            <span className="font-medium">Account Number:</span> {accountNumber}
          </p>
          <p>
            <span className="font-medium">IFSC Code:</span> {ifscCode}
          </p>
        </div>
      </div>

      <div>
        <Button
          isDark={isDark}
          variant="secondary"
          name={<Trash size={16} className="text-rose-500" />}
          handler={(e) => {
            e.preventDefault();
            setIsDeleting(true);
          }}
        />
      </div>
    </label>
  );
};

export default BankAccount;
