"use client";
import React from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  rating: number;
}

interface MobileCardsProps {
  data: Customer[];
}

function MobileCards({ data }: MobileCardsProps) {
  return (
    <>
      {data?.length === 0 ? (
        <div className="md:hidden text-center py-12 text-gray-500">
          No customers found
        </div>
      ) : (
        <div className="md:hidden space-y-4 w-[85vw] mt-3">
          {data.map((customer) => (
            <div key={customer._id} className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">ID:</div>
                <div className="truncate">{customer.name}</div>

                <div className="font-medium">Name:</div>
                <div className="truncate">{customer.name}</div>

                <div className="font-medium">Email:</div>
                <div className="truncate">{customer.email}</div>

                <div className="font-medium">Rating:</div>
                <div className="font-semibold">{customer.rating}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default MobileCards;
