"use client";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import React from "react";
import Button from "../../../../../components/Button";

interface DeleteProps {
  handleDelete: () => void;
  Id: string | number;
  Name: string;
  isDark?:boolean;
}

function Delete({ handleDelete, Id, Name,isDark=false }: DeleteProps) {
  const handleDeleteApi = () => {
    // dispatch(deleteCustomer({ customerId: Id, handleDelete }));
  };
  return (
    <BlurredPopupLayout width={"30%"} height={"auto"} isDark={isDark}>
        <h2 className="text-xl font-bold mb-4 text-center">
          Delete a Customer
        </h2>
        <p className="text-l font-bold mb-4 text-center text-red-500">
          Really want to delete {Name} with id:{Id}
        </p>
        <div className="flex gap-7 justify-center">
          <Button
          name={"Cancel"}
            onClick={() => handleDelete()}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
          </Button>
          <Button
          name={"Submit"}
            onClick={() => handleDelete()}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
          </Button>
        </div>
    </BlurredPopupLayout>
  );
}

export default Delete;
