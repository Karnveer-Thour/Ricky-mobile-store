"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Addressinfovalidation,
  Personalinfovalidation,
} from "./utils/Personalinfovalidation";

type PersonalInfoCardProps = {
  formData: { [key: string]: any };
  Cardname: string;
  isDark?: boolean;
};

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  formData,
  Cardname,
  isDark = false,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleEditClick = () => {
    setIsEditing(true);
    reset(formData);
  };

  return (
    <div
      className={`max-w-[95%] sm:ms-7 max-sm:ms-4 p-6 rounded-3xl mt-8 border shadow-md ${
        isDark ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-800 border-gray-300"
      }`}
    >
      <div
        className={`flex justify-between items-center mb-4 p-2 border-b-2 ${
          isDark ? "border-gray-600" : "border-gray-400"
        }`}
      >
        <h2 className="text-lg font-semibold">{Cardname}</h2>
        {!isEditing && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={handleEditClick}
          >
            Edit
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          setIsEditing(false);
        })}
      >
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {Object.entries(formData).map(
            ([key, value]) =>
              !(key === "imageURL" || key === "role") && (
                <div key={key}>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {key
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                    {key === "phone" ? " Number" : ""}
                  </p>
                  {isEditing ? (
                    <div>
                      <input
                        type={
                          key === "date_birth"
                            ? "date"
                            : key === "email"
                            ? "email"
                            : "text"
                        }
                        {...register(key)}
                        className={`border rounded-lg p-2 w-full ${
                          isDark
                            ? "bg-gray-800 text-white border-gray-600"
                            : "bg-white text-black border-gray-300"
                        }`}
                      />
                      {errors[key] && (
                        <span className="text-sm text-red-600">
                          {/* {errors[key].message} */}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="font-medium">{value}</p>
                  )}
                </div>
              )
          )}
        </div>

        {isEditing && (
          <div className="mt-4">
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Submit
            </button>
            <button
              type="button"
              className="ms-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoCard;