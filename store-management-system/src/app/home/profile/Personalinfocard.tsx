"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { updateAdmin } from "@/Redux/Services/adminServices";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Addressinfovalidation,
  Personalinfovalidation,
} from "./utils/Personalinfovalidation";
// import {
//   Addressinfovalidation,
//   Personalinfovalidation,
// } from "@/Components/Profile/utils/Personalinfovalidation";

type PersonalInfoCardProps = {
  formData: { [key: string]: any };
  Cardname: string;
};

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  formData,
  Cardname,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const handleEditClick = () => {
    setIsEditing(true);
    reset(formData); // Reset form values when editing starts
  };

  // const onSubmit = (data) => {
  //   dispatch(updateAdmin(data, dispatch));
  //   setIsEditing(false);
  // };

  return (
    <div className="max-w-[95%] sm:ms-7 max-sm:ms-4 p-6 bg-white rounded-3xl mt-8 mt-shadow-md border">
      <div className="flex justify-between items-center mb-4 p-2 border-b-2 border-gray-600">
        <h2 className="text-lg font-semibold text-gray-800">{Cardname}</h2>
        {!isEditing ? (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={handleEditClick}
          >
            Edit
          </button>
        ) : null}
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          // handle form submission here
          // Example: console.log(data);
          setIsEditing(false);
        })}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          {Object.entries(formData).map(
            ([key, value]) =>
              !(key === "imageURL" || key === "role") && (
                <div key={key}>
                  <p className="text-sm text-gray-500">
                    {key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
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
                        className="border rounded-lg p-2 w-full"
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
              ),
          )}
        </div>
        {isEditing && (
          <>
            <button
              type="submit"
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Submit
            </button>
            <button
              className="mt-4 ms-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              onClick={(e) => {
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoCard;
