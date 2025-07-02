import React, { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const ImageCropper: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [croppedData, setCroppedData] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropper = useRef<Cropper | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
    }
  };

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

  const handleCrop = () => {
    if (cropper.current) {
      const canvas = cropper.current.getCroppedCanvas();
      const croppedImage = canvas.toDataURL("image/png");
      setCroppedData(croppedImage);
    }
  };

  return (
    <div className="p-5 space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />

      {imageURL && (
        <div className="border-2 border-red-500 rounded-md p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Crop the image:</h2>
          <div className="w-full overflow-hidden rounded-md">
            <img
              ref={imageRef}
              src={imageURL}
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
      )}

      {croppedData && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">Cropped Result:</h2>
          <img
            src={croppedData}
            alt="Cropped"
            className="rounded-md border border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;