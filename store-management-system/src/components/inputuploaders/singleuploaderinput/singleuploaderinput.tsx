import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import ImageCropper from "../imagecroppers/singleimagecropper";

interface singleInputProps {
  prevPicture?: File;
  isDark?: boolean;
  features?: {
    crop: boolean;
  };
}

const SingleUploaderInput = ({
  prevPicture,
  isDark = false,
  features,
}: singleInputProps) => {
  const picURL = prevPicture ? URL.createObjectURL(prevPicture) : "";
  const [picture, setPicture] = useState<string | undefined>(picURL);
  const [croppedPicture, setCroppedPicture] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  const handleSelectPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      if (picture) URL.revokeObjectURL(picture);
      if (croppedPicture) URL.revokeObjectURL(croppedPicture);

      const imageURL = URL.createObjectURL(files[0]);
      features?.crop ? setPicture(imageURL) : setCroppedPicture(imageURL);
    }
    e.target.value = "";
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (croppedPicture) {
      URL.revokeObjectURL(croppedPicture);
    }
    setCroppedPicture(undefined);
  };

  const setCropImage = (image: string): void => {
    setCroppedPicture(image);
    setPicture(undefined);
  };

  const closeCropper = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (picture) URL.revokeObjectURL(picture);
    setPicture(undefined);
  };

  return (
    <div className="flex gap-4 flex-wrap mt-1.5 w-32 ">
      {picture && (
        <ImageCropper
          isDark={isDark}
          imageURL={picture}
          handleClose={closeCropper}
          setCroppedPicture={setCropImage}
        />
      )}
      {croppedPicture ? (
        <div
          className={`relative w-32 h-32 border-2 ${isDark ? "border-white" : "border-gray-500"} rounded-xl overflow-hidden`}
        >
          <img
            src={croppedPicture}
            alt={`Uploaded`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      ) : (
        <div
          className={`w-32 h-32 border-2 border-dashed ${isDark ? "border-white" : "border-gray-500"} rounded-xl flex items-center justify-center hover:border-blue-500 transition-all cursor-pointer group`}
          onClick={openFileDialog}
        >
          <div
            className={`flex flex-col items-center ${isDark ? "text-white" : "text-gray-500"} group-hover:text-blue-500`}
          >
            <Upload size={28} />
            <span className="text-sm mt-1 text-center">Add Images</span>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png"
            ref={inputRef}
            multiple
            onChange={handleSelectPicture}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default SingleUploaderInput;
