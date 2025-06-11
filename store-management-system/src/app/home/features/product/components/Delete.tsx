"use client";
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
    <div
      className={`flex backdrop-blur-sm flex-col fixed top-0 z-50 w-screen h-screen items-center justify-center transition-all duration-300 rounded-lg overflow-hidden`}
    >
      <span className="border w-[40%] p-5 -ms-20 rounded-xl bg-gray-100  shadow-md">
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
      </span>
    </div>
  );
}

export default Delete;
