"use client";
import React, { useRef, useState } from "react";
import Button from "@/components/Button";
import { CircleCheckBig, UploadCloud } from "lucide-react";
import {
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleFileChange,
} from "../utils/fileFunctions";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useDispatch } from "react-redux";
import { ERRORALERT } from "@/store/slices/alert.slice";

type CsvUploadProps = {
  cancelUpload: () => void;
  uploadCsv?: () => void;
  isDark?: boolean;
};

function CsvUpload({
  cancelUpload,
  isDark = false,
  uploadCsv,
}: CsvUploadProps) {
  const [isDragging, setIsDragging]: any = useState(false);
  const [file, setFile]: any = useState(null);
  const fileInputRef: any = useRef(null);
  const dispatch = useDispatch();
  const textColor = isDark ? "text-white" : "text-gray-700";
  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <BlurredPopupLayout isDark={isDark} width={"60%"} height={"50%"}>
      <p className="text-lg font-bold">Upload your CSV file here</p>
      <div
        className={`flex flex-col justify-center items-center w-[80%] h-[80%] p-2 gap-4 border-2 border-dashed rounded-lg ${isDark && "bg-gray-500"}
          ${
            isDragging &&
            (isDark ? "border-black bg-gray-600" : "border-blue-400 bg-blue-50")
          }
        `}
        onDragOver={(e) => handleDragOver(e, setIsDragging)}
        onDragLeave={(e) => handleDragLeave(setIsDragging)}
        onDrop={(fileObject) =>
          handleDrop(fileObject, setFile, setIsDragging, dispatch, ERRORALERT)
        }
        onClick={openFileDialog}
      >
        <div className="flex justify-center w-full gap-10">
          <div
            className={`${file ? "bg-green-100" : "bg-blue-100"} p-4 rounded-full basis-30 h-30 flex justify-center items-center transition-colors duration-1000 ease-in-out`}
          >
            {file ? (
              <CircleCheckBig className="text-green-600  w-25 h-25 transition-all duration-1000" />
            ) : (
              <UploadCloud className="text-blue-600 w-15 h-15 transition-all duration-1000" />
            )}
          </div>
          {file && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className={`text-sm ${textColor}`}>
                📄 <strong>{file.name}</strong>
              </p>
              <p className={`text-xs ${textColor}`}>
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={(fileObject) =>
                  handleFileChange(fileObject, setFile, dispatch, ERRORALERT)
                }
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Upload another file
              </button>
            </div>
          )}
        </div>
        <p className={`text-lg font-bold ${textColor}`}>
          Upload product proper formatted spreadSheet
        </p>
        <p className={`text-lg ${textColor}`}>Maximum file size: 100 MB</p>
        <p className={`text-lg ${textColor}`}>Supported Format: .csv</p>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={(fileObject) => {
            handleFileChange(fileObject, setFile, dispatch, ERRORALERT);
          }}
          className="hidden"
        />
      </div>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button
          name={"Cancel"}
          handler={() => {
            setFile(null), cancelUpload();
          }}
        />
        <Button name={"Upload CSV"} handler={uploadCsv} />
      </div>
    </BlurredPopupLayout>
  );
}

export default CsvUpload;
