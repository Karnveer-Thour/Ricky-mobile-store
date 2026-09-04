"use client";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import React from "react";
import Button from "../../../../../components/Button";

interface DeleteProps {
  handleDelete: () => void;
  Id: string | number;
  Name: string;
  isDark?: boolean;
}

function Delete({ handleDelete, Id, Name, isDark = false }: DeleteProps) {
  const handleDeleteApi = () => {
    // dispatch(deleteCustomer({ customerId: Id, handleDelete }));
  };

  return (
    <BlurredPopupLayout width={"420px"} height={"auto"} isDark={isDark}>
      <div className="p-2 text-center space-y-4">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Delete Bank Account</h2>
        <p className="text-sm font-medium text-rose-500">
          Are you sure you want to remove <span className="font-bold">{Name}</span> (A/C: {Id})?
        </p>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          This account will no longer receive automated payouts and settlements.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button
            name={"Cancel"}
            isDark={isDark}
            variant="secondary"
            handler={() => handleDelete()}
          />
          <Button
            name={"Confirm Delete"}
            variant="danger"
            handler={() => handleDelete()}
          />
        </div>
      </div>
    </BlurredPopupLayout>
  );
}

export default Delete;
