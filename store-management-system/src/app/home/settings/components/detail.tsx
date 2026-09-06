import Button from "@/components/Button";
import Input from "@/components/Input";
import { Check, CircleX } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { storeType } from "@/types/store.index";

type detailsArray = {
  id: number;
  title?: string;
  value: string;
};
interface DetailProps {
  title: string;
  details: detailsArray[];
}
const Detail = ({ title, details }: DetailProps) => {
  const isDark = useSelector((state: storeType) => state.DarkMode.isDarkMode);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex justify-center w-full overflow-hidden max-sm:h-auto">
      <div
        className={`pb-6 w-[95%] border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}
      >
        <p
          className={`ms-2 mt-4 text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </p>
        {!isEditing ? (
          <div className="w-full flex justify-between items-center mt-3">
            <div className="space-y-1.5">
              {details.map((detail) => (
                <div key={detail.id} className="ms-2 text-sm">
                  {detail.title && (
                    <span
                      className={`font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {detail.title}:{" "}
                    </span>
                  )}
                  <span
                    className={`font-medium ${isDark ? "text-slate-200" : "text-slate-900"}`}
                  >
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <Button
                isDark={isDark}
                name={"Edit"}
                variant="secondary"
                handler={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center mt-3">
            <div className="space-y-2">
              {details.map((detail) => (
                <div key={detail.id} className="ms-2 flex items-center gap-2">
                  {detail.title && (
                    <span
                      className={`font-semibold text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {detail.title}:{" "}
                    </span>
                  )}
                  <Input
                    type="text"
                    defaultValue={detail.value}
                    isDark={isDark}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                isDark={isDark}
                name={<Check size={16} />}
                handler={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                }}
              />
              <Button
                isDark={isDark}
                variant="secondary"
                name={<CircleX size={16} />}
                handler={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
