"use client";
import React, { useState, useEffect } from "react";
import BlurredPopupLayout from "@/layout/blurredPopupLayout";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";
import ToggleButton from "@/components/togglebutton";
import { cityService } from "@/services/city.service";
import { MapPin, Check, X } from "lucide-react";

function updateCity() {
  const router = useRouter();
  const isDark = useSelector((store: storeType) => store.DarkMode.isDarkMode);
  const [cityId, setCityId] = useState<string>("");
  const [isAccepting, setIsAccepting] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cityData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCityId(parsed._id || parsed.id || "");
          setValue("name", parsed.name || "");
          setValue("district", parsed.district || "");
          setValue("state", parsed.state || "");
          setValue("pincode", String(parsed.pincode || ""));
          setIsAccepting(parsed.isAccepting ?? true);
        } catch (e) {
          console.warn("Failed to parse cityData from localStorage", e);
        }
      }
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    if (!cityId) {
      setSubmitError("No city ID selected for update.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      name: data.name,
      district: data.district,
      state: data.state,
      pincode: Number(data.pincode) || 0,
      isAccepting: isAccepting,
    };

    const res = await cityService.updateCity(cityId, payload);
    setIsSubmitting(false);

    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cityData");
      }
      router.back();
    } else {
      setSubmitError(res.message || "Failed to update city. Please try again.");
    }
  };

  return (
    <BlurredPopupLayout
      title="Edit Deliverable City"
      subtitle="Update coverage status, PIN code, and dispatch settings"
      icon={<MapPin size={20} />}
      isDark={isDark}
      maxWidth="max-w-xl"
    >
      {submitError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <X size={14} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form
        id="update-city-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Inputcontainer
          label="City Name"
          required
          error={errors?.name}
          isDark={isDark}
        >
          <Input
            id="name"
            placeholder="Enter city name"
            {...register("name", { required: "City name is required" })}
          />
        </Inputcontainer>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Inputcontainer
            label="District"
            required
            error={errors?.district}
            isDark={isDark}
          >
            <Input
              id="district"
              placeholder="District name"
              {...register("district", { required: "District is required" })}
            />
          </Inputcontainer>

          <Inputcontainer
            label="State"
            required
            error={errors?.state}
            isDark={isDark}
          >
            <Input
              id="state"
              placeholder="State name"
              {...register("state", { required: "State is required" })}
            />
          </Inputcontainer>
        </div>

        <Inputcontainer
          label="Postal Code / PIN"
          required
          error={errors?.pincode}
          isDark={isDark}
        >
          <Input
            id="pincode"
            type="number"
            placeholder="PIN Code"
            {...register("pincode", { required: "PIN code is required" })}
          />
        </Inputcontainer>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
          <div>
            <p className="text-sm font-semibold text-white">
              Accept Online Delivery Orders
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggle live checkout availability for this zone
            </p>
          </div>
          <ToggleButton
            activeLabel="Active"
            inactiveLabel="Disabled"
            defaultActive={isAccepting}
            handler={(val) => setIsAccepting(val)}
            isDark={isDark}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <Button
            type="button"
            name="Cancel"
            variant="ghost"
            handler={() => router.back()}
          />
          <Button
            type="submit"
            name="Save Changes"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            icon={<Check size={16} />}
          />
        </div>
      </form>
    </BlurredPopupLayout>
  );
}

export default updateCity;
