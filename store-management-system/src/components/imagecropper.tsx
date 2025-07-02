import React, { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

interface imageCropperProps {
  isDark?: boolean;
  imageURL: string;
  setTempPicture: React.Dispatch<React.SetStateAction<File | null>>;
  setCroppedPicture: (picture: File) => void;
}

const ImageCropper = ({
  isDark,
  imageURL,
  setTempPicture,
  setCroppedPicture,
}: imageCropperProps) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropper = useRef<Cropper | null>(null);

  useEffect(() => {
    if (imageRef.current && imageURL) {
      cropper.current?.destroy();

      cropper.current = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
      });
    }

    return () => {
      cropper.current?.destroy();
    };
  }, [imageURL]);

  const handleCrop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (cropper.current) {
      const canvas = cropper.current.getCroppedCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped.png", { type: "image/png" });
          setCroppedPicture(file);
        }
      }, "image/png");
    }
  };

  return (
    <div className="border-2 border-red-500 rounded-md p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Crop the image:</h2>
      <div className="w-full overflow-hidden rounded-md">
        <img
          ref={imageRef}
          src={imageURL as any}
          alt="To crop"
          className="max-w-full max-h-[400px] object-contain"
        />
      </div>
      <button
        onClick={handleCrop}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Crop
      </button>
    </div>
  );
};

export default ImageCropper;
