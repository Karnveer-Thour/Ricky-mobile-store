import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

const SingleUploaderInput = ({ prevPicture }: { prevPicture?: File }) => {
  const [picture, setPicture] = useState<File | undefined>(prevPicture);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  const removeImage = () => {
    setPicture(undefined);
  };

  return (
    <div className="flex gap-4 flex-wrap mt-1.5">
      {picture ? (
        <div className="relative w-32 h-32 border-2 border-gray-300 rounded-xl overflow-hidden">
          <img
            src={URL.createObjectURL(picture)}
            alt={`Uploaded`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => removeImage()}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      ) : (
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
              const file = e.target.files;
              if (file && file[0]) {
                setPicture(file[0]);
              }
            }}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default SingleUploaderInput;
