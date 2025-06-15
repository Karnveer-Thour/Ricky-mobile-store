"use client";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import React from "react";
import { useDispatch } from "react-redux";

interface DeleteProps {
  handleDelete: () => void;
  Id: string | number;
  Name: string;
}

function Delete({ handleDelete, Id, Name }: DeleteProps) {
  const handleDeleteApi = () => {
    // dispatch(deleteCustomer({ customerId: Id, handleDelete }));
  };
  return (
    <BlurredPopupLayout width={"30%"} height={"auto"}>
        <h2 className="text-xl font-bold mb-4 text-center">
          Delete a Customer
        </h2>
        <p className="text-l font-bold mb-4 text-center text-red-500">
          Really want to delete {Name} with id:{Id}
        </p>
        <div className="flex gap-7 justify-center">
          <button
            onClick={() => handleDelete()}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteApi()}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
    </BlurredPopupLayout>
  );
}

export default Delete;
