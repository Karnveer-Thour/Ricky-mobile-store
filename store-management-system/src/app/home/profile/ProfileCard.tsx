"use client";
import { useState } from "react";
import { Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/Card";

interface ProfileCardProps {
  formData: {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    imageURL: string;
    // Add other fields as needed
  };
}

const ProfileCard = ({ formData }: ProfileCardProps) => {
  // const Admin=useSelector(store=>store.Admin.user);
  const dispatch=useDispatch();
  const [data, setData] = useState(formData);
  const [Loading,setLoading]=useState(false);
  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     uploadImage(file,setLoading,dispatch,Admin.id,setData);
  //   }
  // };

  return (
    <Card>
      <div className="relative w-50 h-50 sm:ms-15 flex items-center justify-center bg-gray-600 rounded-full">
        <img
          src={!Loading?data.imageURL:"https://res.cloudinary.com/dszgssbnh/image/upload/v1742290154/Marketplace/gvpccbc1jfzodruyussw.gif"}
          alt="Profile"
          className="w-[100%] h-[100%] rounded-full object-fill border-2 border-gray-300 shadow-md"
        />
        <label className="absolute top-7 right-2.5 bg-white rounded-full shadow cursor-pointer p-1 ">
          <Camera size={25} className="text-gray-600 hover:text-indigo-600" />
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png" 
            // onChange={handleImageChange}
          />
        </label>
      </div>
      <div className="sm:ms-15 max-sm:mt-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700 max-sm:text-center">
          {formData.first_name + " " + formData.last_name}
        </h2>
        <p className="text-sm text-gray-500 max-sm:text-center">
          {formData.role}
        </p>
        <p className="text-sm text-gray-500 max-sm:text-center">
          {formData.email}
        </p>
      </div>
    </Card>
  );
};

export default ProfileCard;
