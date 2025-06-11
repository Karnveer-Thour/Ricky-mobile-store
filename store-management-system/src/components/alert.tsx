"use client";
import { CLOSEALERT } from "@/store/slices/alert.slice";
import { storeType } from "@/types/store.index";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Alert = () => {
  const [isVisible, setVisible] = useState(true);
  const { type, message, id } = useSelector(
    (store: storeType) => store.Alert || {},
  );
  const dispatchAlert = useDispatch();

  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  const closeAlertLogic=(closeTime?:number,reVisibleTime?:number)=>{
    if (type) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          dispatchAlert(CLOSEALERT(null));
          setVisible(true);
        }, reVisibleTime||1000);
      },closeTime||3000);

      return () => clearTimeout(timer);
    }
  }

  const handleClose = () => {
    closeAlertLogic(100,500);
  };

  useEffect(() => {
    return closeAlertLogic(3000,1000);
  }, [id]);

  return (
    <>
      {type && (
        <div
          className={`z-100 border px-4 py-3 rounded mt-5 w-[90%] md:w-[30%] h-[%] mx-auto overflow-hidden fixed bottom-5 right-5 max-md:left-5 max-md:right-0 flex items-center ${
            alertStyles[type]
          } transition-all duration-1000 ease-in-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
          role="alert"
          aria-live="assertive"
        >
          <span className="block sm:inline">{message}</span>
          <button
            onClick={handleClose}
            disabled={!isVisible}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Close alert"
          >
            <svg
              className="fill-current h-6 w-6"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 01-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 011.414-1.414l2.93 2.93 2.93-2.93a1 1 0 011.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Alert;
