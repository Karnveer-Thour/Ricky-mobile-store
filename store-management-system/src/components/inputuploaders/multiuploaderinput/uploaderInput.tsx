import { Upload, X } from "lucide-react";
import React, {useRef, useState } from "react";
import ImageCropper from "../imagecroppers/multiimagecropper";

interface uploaderInputProps {
  isDark?: boolean;
  features?: {
    crop: boolean;
  };
}

const UploaderInput = ({ isDark, features }: uploaderInputProps) => {
  const [picture, setPicture] = useState<string | undefined>();
  const [finalPictures, setFinalPictures] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalToCrop, setTotalToCrop] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const picturesQueue = useRef<string[]>([]);

  const openFileDialog = () => {
    inputRef?.current?.click();
  };

  const handleSelectPicture = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    const files = e.target.files;
    if (files) {
      const selectedFiles: File[] = Array.from(files);
      const images = selectedFiles.map((image) => URL.createObjectURL(image));

      if (features?.crop) {
        picturesQueue.current = images;
        setTotalToCrop(images.length);
        setCurrentIndex(1);
        setPicture(picturesQueue.current?.shift());
      } else {
        setFinalPictures((prev) => [...prev, ...images]);
      }
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    URL.revokeObjectURL(finalPictures[index]);
    setFinalPictures((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelAllCropImages = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    picturesQueue.current = [];
    setPicture(undefined);
  };

  const skipAllCropImages = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const finalPictures: string[] = [
      ...picturesQueue.current,
      picture ? picture : "",
    ];
    console.log(finalPictures);
    setPicture(undefined);
    picturesQueue.current = [];
    setCurrentIndex(0);
    setTotalToCrop(0);
    setFinalPictures((prev) => [...prev, ...finalPictures]);
  };

  const closeCropImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPicture(picturesQueue.current.shift());
    setTotalToCrop((prev) => prev - 1);
  };

  const setCropImage = (image: string): void => {
    if (picture) {
      URL.revokeObjectURL(picture);
    }
    setFinalPictures((prev) => [...prev, image]);
    const nextImage = picturesQueue.current.shift();

    if (nextImage) {
      setPicture(nextImage);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPicture(undefined);
      setCurrentIndex(0);
      setTotalToCrop(0);
    }
  };

  return (
    <div className="flex gap-4 flex-wrap mt-1.5">
      {finalPictures.map((pic, index) => (
        <div
          key={index}
          className="relative w-32 h-32 border-2 border-gray-300 rounded-xl overflow-hidden"
        >
          <img
            src={pic}
            alt={`Uploaded ${index}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              removeImage(e, index)
            }
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      ))}
      {picture && (
        <ImageCropper
          isDark={isDark}
          imageURL={picture}
          setCroppedPicture={setCropImage}
          handleClose={closeCropImage}
          currentCropIndex={currentIndex}
          totalToCrop={totalToCrop}
          handleCancelAll={cancelAllCropImages}
          handleSkipAll={skipAllCropImages}
        />
      )}

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
          onChange={handleSelectPicture}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploaderInput;
