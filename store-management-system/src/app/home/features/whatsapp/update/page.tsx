"use client";
import React, { useState, useEffect } from "react";
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
import { Edit3 } from "lucide-react";

export default function UpdateWhatsappGroup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [groupId, setGroupId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("whatsappGroupData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setGroupId(parsed._id || parsed.id || "");
          setValue("name", parsed.groupName || parsed.name || "");
          setValue("url", parsed.url || "");
          setIsActive(parsed.status !== undefined ? parsed.status : true);
        } catch {}
      }
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    if (!data.name || !data.url) {
      dispatch(ERRORALERT("Please enter group name and URL"));
      return;
    }

    setLoading(true);
    try {
      const res = await whatsappService.updateGroup(groupId, {
        groupName: data.name,
        url: data.url,
        status: isActive,
      });

      if (res.ok) {
        dispatch(SUCCESSALERT("WhatsApp Group updated successfully!"));
        if (typeof window !== "undefined") {
          localStorage.removeItem("whatsappGroupData");
        }
        router.push("/home/features/whatsapp");
      } else {
        dispatch(ERRORALERT(res.message || "Failed to update group"));
      }
    } catch {
      dispatch(ERRORALERT("Failed to update group. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlurredPopupLayout width={"60%"} height={"auto"} isDark={isDark}>
      <div
        className={`w-full flex items-center gap-3 border-b pb-4 mb-4 ${isDark ? "border-white/10" : "border-slate-200"}`}
      >
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold">
          <Edit3 size={22} />
        </div>
        <div>
          <h2
            className={`text-xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Update WhatsApp Group
          </h2>
          <p
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Modify group link and active broadcasting status
          </p>
        </div>
      </div>

      <form
        id="update-whatsapp-form"
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
            placeholder="Enter Group Name"
            {...register("name", { required: true })}
            isDark={isDark}
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
            placeholder="Enter Group Url"
            {...register("url", { required: true })}
            isDark={isDark}
          />
        </Inputcontainer>

        <div
          className={`flex items-center justify-between p-3 rounded-xl border ${
            isDark
              ? "bg-slate-900/60 border-white/5"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <span
            className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            Broadcasting Status:
          </span>
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
            name={loading ? "Updating..." : "Update Group"}
            disabled={loading}
            handler={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}
