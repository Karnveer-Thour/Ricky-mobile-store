"use client";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import React, { useState } from "react";
import Button from "@/components/Button";
import { productService } from "@/services/product.service";

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
    const res = await productService.deleteProduct(Id);
    setIsDeleting(false);
    if (res.ok) {
      handleDelete();
    } else {
      setError(res.message || "Failed to delete product");
    }
  };

  return (
    <BlurredPopupLayout width={"30%"} height={"auto"} isDark={isDark}>
      <h2 className="text-xl font-bold mb-4 text-center">Delete Product</h2>
      {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}
      <p className="text-sm font-semibold mb-6 text-center text-red-500">
        Are you sure you want to delete {Name}?
      </p>
      <div className="flex gap-4 justify-center">
        <Button
          name={"Cancel"}
          handler={() => handleDelete()}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        />
        <Button
          name={isDeleting ? "Deleting..." : "Delete"}
          handler={onConfirm}
          disabled={isDeleting}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        />
      </div>
    </BlurredPopupLayout>
  );
}

export default Delete;
