"use client";
import React, { useState } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { storeType } from "@/types/store.index";
import ToggleButton from "@/components/togglebutton";
import { whatsappService } from "@/services/whatsapp.service";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";
import { MessageCirclePlus } from "lucide-react";

export default function AddWhatsappGroup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (!data.name || !data.url) {
      dispatch(ERRORALERT("Please enter group name and invite URL"));
      return;
    }

    setLoading(true);
    try {
      const res = await whatsappService.createGroup({
        groupName: data.name,
        url: data.url,
        status: isActive,
      });

      if (res.ok) {
        dispatch(SUCCESSALERT("WhatsApp Group added successfully!"));
        router.push("/home/features/whatsapp");
      } else {
        dispatch(ERRORALERT(res.message || "Failed to create group"));
      }
    } catch {
      dispatch(ERRORALERT("Failed to create group. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <div className="w-full flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-slate-950 font-bold">
          <MessageCirclePlus size={22} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Add WhatsApp Group</h2>
          <p className="text-xs text-slate-400">Connect a community or customer VIP broadcast channel</p>
        </div>
      </div>

      <form
        id="add-whatsapp-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Inputcontainer
          type="text"
          label="Group Name"
          error={errors?.name}
          isDark={isDark}
        >
          <Input
            id="Group Name"
            placeholder="e.g. Ricky Mobile VIP Flash Deals"
            {...register("name", { required: true })}
            className={`border ${isDark ? "border-slate-700 text-white" : "border-gray-300"} font-medium`}
          />
        </Inputcontainer>

        <Inputcontainer
          type="text"
          label="WhatsApp Invite Link"
          error={errors?.url}
          isDark={isDark}
        >
          <Input
            id="Group Url"
            placeholder="https://chat.whatsapp.com/..."
            {...register("url", { required: true })}
            className={`border ${isDark ? "border-slate-700 text-white" : "border-gray-300"} font-medium`}
          />
        </Inputcontainer>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
          <span className="text-xs font-bold text-slate-300">Broadcasting Status:</span>
          <ToggleButton
            isDark={isDark}
            activeLabel="Active"
            inactiveLabel="Inactive"
            handler={(val: boolean) => setIsActive(val)}
          />
        </div>

        <div className="flex flex-row justify-between items-center w-full pt-4 border-t border-white/10 gap-4">
          <Button name={"Cancel"} handler={() => router.back()} />
          <Button
            name={loading ? "Saving..." : "Create Group"}
            disabled={loading}
            handler={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}
