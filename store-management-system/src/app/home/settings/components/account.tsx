import Button from "@/components/Button";
import Input from "@/components/Input";
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
    if(isDeleting){
        return(
            <Delete Name={bankName} Id={accountNumber} isDark={isDark} handleDelete={() => setIsDeleting(false)} />
        )
    }
  return (
    <label className="w-full border border-gray-300 rounded-xl p-4 cursor-pointer flex gap-4 items-center justify-between hover:bg-gray-50 transition">
      {/* Native radio input */}
      <input
        type="radio"
        name="bankAccount"
        value={value}
        checked={selected}
        onChange={onChange}
        className="w-4 h-4"
      />

      <div className="flex flex-col flex-grow ms-2">
        <p className="text-lg font-semibold text-gray-800">{bankName}</p>
        <div className="text-sm text-gray-600 mt-1">
          <p>Account Number: {accountNumber}</p>
          <p>IFSC Code: {ifscCode}</p>
        </div>
      </div>

      <div>
        <Button name={<Trash />} handler={(e)=>{e.preventDefault();setIsDeleting(true)}}/>
      </div>
    </label>
  );
};

export default BankAccount;