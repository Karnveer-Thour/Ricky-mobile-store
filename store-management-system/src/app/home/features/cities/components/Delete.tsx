"use client";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import React, { useState } from "react";
import Button from "@/components/Button";
import { cityService } from "@/services/city.service";

interface DeleteProps {
  handleDelete: () => void;
  Id: string | number;
  Name: string;
  isDark?: boolean;
}

function Delete({ handleDelete, Id, Name, isDark = false }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const onConfirm = async () => {
    setIsDeleting(true);
    setError("");
    const res = await cityService.deleteCity(Id);
    setIsDeleting(false);
    if (res.ok) {
      handleDelete();
    } else {
      setError(res.message || "Failed to delete city");
    }
  };

  return (
    <BlurredPopupLayout width={"400px"} height={"auto"} isDark={isDark}>
      <div className="p-2 text-center space-y-4">
        <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Delete City</h2>
        {error && (
          <p className="text-xs text-rose-500 font-semibold">{error}</p>
        )}
        <p className="text-sm font-medium text-rose-500">
          Are you sure you want to delete <span className="font-bold">{Name}</span>?
        </p>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          This will permanently remove the city from your active delivery zones.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button
            name={"Cancel"}
            isDark={isDark}
            variant="secondary"
            handler={() => handleDelete()}
          />
          <Button
            name={isDeleting ? "Deleting..." : "Delete City"}
            variant="danger"
            handler={onConfirm}
            disabled={isDeleting}
          />
        </div>
      </div>
    </BlurredPopupLayout>
  );
}

export default Delete;
