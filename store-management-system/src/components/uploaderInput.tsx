import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface uploaderInputProps {
  setTempPicture?: React.Dispatch<React.SetStateAction<File | null>>;
  pictures:File[];
  setPictures:React.Dispatch<React.SetStateAction<File[]>>;
}

const UploaderInput = ({
  setTempPicture,
  pictures,
  setPictures,
}: uploaderInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  const removeImage = (index: number) => {
    setPictures((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-4 flex-wrap mt-1.5">
      {pictures.map((pic, index) => (
        <div
          key={index}
          className="relative w-32 h-32 border-2 border-gray-300 rounded-xl overflow-hidden"
        >
          <img
            src={URL.createObjectURL(pic)}
            alt={`Uploaded ${index}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      ))}

      <div
        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-500 transition-all cursor-pointer group"
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500">
          <Upload size={28} />
          <span className="text-sm mt-1 text-center">Add Images</span>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={inputRef}
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const selectedFiles = Array.from(files);
              setTempPicture ? setTempPicture(selectedFiles[0] || null) : "";
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploaderInput;
