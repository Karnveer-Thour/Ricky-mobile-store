import React, { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import Button from "../../Button";
import Loader from "../../loader";

interface imageCropperProps {
  isDark?: boolean;
  imageURL: string;
  setCroppedPicture: (picture: string) => void;
  handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ImageCropper = ({
  isDark,
  imageURL,
  setCroppedPicture,
  handleClose,
}: imageCropperProps) => {
  const [isCropping, setIsCropping] = useState<boolean>(false);
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
  }, [imageURL, isCropping]);

  const handleCrop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsCropping(true);
    if (cropper.current) {
      const canvas = cropper.current.getCroppedCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped.png", { type: "image/png" });
          const imageUrl = URL.createObjectURL(file);
          setCroppedPicture(imageUrl);
        }
        setIsCropping(false);
      }, "image/png");
    }
  };
  return (
    <BlurredPopupLayout width={"40%"} height={"auto"} isDark={isDark}>
      <h2 className="text-lg font-semibold text-gray-800">Crop the image:</h2>
      <div className="w-full overflow-hidden rounded-md p-5">
        {isCropping ? (
          <Loader label="Cropping..." />
        ) : (
          <img
            key={imageURL}
            ref={imageRef}
            src={imageURL}
            alt="To crop"
            className="max-w-full max-h-[400px] object-contain"
          />
        )}
      </div>
      <div className="flex flex-row justify-between items-center w-full h-[20%] p-2 gap-4">
        <Button name="Cancel" handler={handleClose} disabled={isCropping} />
        <Button name={"Crop"} handler={handleCrop} disabled={isCropping} />
      </div>
    </BlurredPopupLayout>
  );
};

export default ImageCropper;