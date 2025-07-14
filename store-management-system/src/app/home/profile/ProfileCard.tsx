"use client";
import { useState } from "react";
import { Camera } from "lucide-react";
import { useDispatch } from "react-redux";
import Card from "@/components/Card";

interface ProfileCardProps {
  formData: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    imageURL: string;
  };
  isDark?: boolean;
}

const ProfileCard = ({ formData, isDark = false }: ProfileCardProps) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(formData);
  const [Loading, setLoading] = useState(false);

  return (
    <Card isDark={isDark}>
      <div
        className={`relative w-50 h-50 sm:ms-15 flex items-center justify-center rounded-full ${
          isDark ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <img
          src={
            !Loading
              ? data.imageURL
              : "https://res.cloudinary.com/dszgssbnh/image/upload/v1742290154/Marketplace/gvpccbc1jfzodruyussw.gif"
          }
          alt="Profile"
          className={`w-full h-full rounded-full object-cover border-2 shadow-md ${
            isDark ? "border-gray-500" : "border-gray-300"
          }`}
        />
        <label
          className={`absolute top-7 right-2.5 rounded-full shadow cursor-pointer p-1 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Camera
            size={25}
            className={`hover:text-indigo-600 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          />
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png"
            // onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="sm:ms-15 max-sm:mt-5 flex flex-col gap-4">
        <h2
          className={`text-lg font-semibold max-sm:text-center ${
            isDark ? "text-white" : "text-gray-700"
          }`}
        >
          {formData.first_name + " " + formData.last_name}
        </h2>
        <p
          className={`text-sm max-sm:text-center ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {formData.role}
        </p>
        <p
          className={`text-sm max-sm:text-center ${
            isDark ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {formData.email}
        </p>
      </div>
    </Card>
  );
};

export default ProfileCard;