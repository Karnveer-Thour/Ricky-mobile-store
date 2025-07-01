"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonalInfoCard from "./Personalinfocard";
import ProfileCard from "./ProfileCard";
import Actionbuttons from "@/components/topactionbar/actionbuttons";
import { storeType } from "@/types/store.index";
import Topactionbar from "@/components/topactionbar/topactionbar";

function Profile() {
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const dispatch = useDispatch();
  // const {user,isLoading} = useSelector((store) => store.Admin);
  // useEffect(() => {
  //   if (!user.Personaldata?.first_name) dispatch(getAdmin(localStorage.getItem("token")));
  // }, [user]);
  // if (isLoading) return <Skeltonloader />;
  return (
    <>
      <div className="w-[95%] overflow-hidden sm:ms-5 max-sm:ms-4 h-auto mt-8 ps-5 flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p
          className={`text-3xl font-semibold ${isDark ? "text-white" : "text-gray-700"}`}
        >
          My profile
        </p>
        <hr className="border-t-3 border-gray-700 mt-1 flex-1"></hr>
      </div>
      <ProfileCard
        formData={{
          first_name: "Karanveer",
          last_name: "Thour",
          role: "Admin",
          email: "Karan@gmail.com",
          imageURL: "https://cdn.corenexis.com/view/?img=d/ju28/xnPdPZ.png",
        }}
      />
      <PersonalInfoCard formData={{}} Cardname={"Personal Information"} />
      <PersonalInfoCard formData={{}} Cardname={"Address"} />
    </>
  );
}

export default Profile;
