"use client";
import React from "react";
import Button from "@/components/Button";
import ProductTable from "./components/productTable";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import CsvDownload from "./components/csvDownload";
import Papa from "papaparse";

function page() {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [isDownloadingCsv, setIsDownloadingCsv] = React.useState(false);
  const [isUploadingCsv, setIsUploadingCsv] = React.useState(false);
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);

  const handleSaveFile = (fileData: object) => {
    // Convert the object to CSV format
    const csv = Papa.unparse([fileData]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {isDownloadingCsv && (
        <CsvDownload
          cancelDownload={() => setIsDownloadingCsv(false)}
          downloadCsv={() => {
            handleSaveFile({
              name: "John Doe",
              email: "john@example.com",
            });
          }}
        />
      )}
      <div className=" w-[94%] overflow-hidden sm:ms-10 me-9 mt-8 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p className={`text-3xl ${isDark ? "text-white" : "text-gray-700"} `}>
          Products
        </p>
        <hr
          className={`border-t-3 ${isDark ? "text-gray-100" : "text-gray-700"} mt-1 flex-1`}
        ></hr>
      </div>
      <div className="w-[95%] h-[50vh] mt-8 ms-6 flex flex-col items-center justify-center">
        <div className=" w-full flex flex-row justify-between items-center">
          <div className="flex-1 overflow-hidden sm:ms-7 max-sm:ms-4 h-auto p-3 flex justify-center items-center">
            <Button name={"Add Product"} handler={() => {}} />
          </div>
          <div className="flex-1 overflow-hidden sm:ms-7 max-sm:ms-4 h-auto p-3 flex justify-center items-center">
            <Button
              name={"Download CSV"}
              handler={() => {
                setIsDownloadingCsv(true);
              }}
            />
          </div>
          <div className="flex-1 overflow-hidden sm:ms-7 max-sm:ms-4 h-auto p-3 flex justify-center items-center">
            <Button
              name={"Upload CSV"}
              handler={() => {
                setIsUploadingCsv(true);
              }}
            />
          </div>
        </div>
        <div className="w-full h-[80%] ms-7 overflow-hidden flex justify-center items-center">
          <ProductTable isDark={isDark} />
        </div>
      </div>
    </>
  );
}

export default page;
