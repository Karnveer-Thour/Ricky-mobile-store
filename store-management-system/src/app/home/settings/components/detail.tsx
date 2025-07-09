import Button from "@/components/Button";
import Input from "@/components/Input";
import { Check, CircleX } from "lucide-react";
import React, { useState } from "react";

type detailsArray = {
  id: number;
  title?: string;
  value: string;
};
interface DetailProps {
  title: String;
  details: detailsArray[];
}
const Detail = ({ title, details }: DetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex justify-center w-full overflow-hidden max-sm:h-auto">
      <div className="pb-4 w-[93%] border-b-2 me-6">
        <p className="w-[93%] ms-5 mt-8 text-2xl font-bold">{title}</p>
       {!isEditing ? <div className="w-full h-[70%] overflow-y-auto flex justify-between">
          <div>
          {details.map((detail) => (
            <div key={detail.id} className="ms-5 mt-2">
              {detail.title && <span className="font-semibold">{detail.title}: </span>}
              <span>{detail.value}</span>
            </div>
          ))}
          </div>
          <div className="w-40 h-15 flex justify-center items-center">
            <div className="w-[60%]">
            <Button name={"Edit"} handler={(e)=>{e.preventDefault();setIsEditing(true)}}/>
            </div>
          </div>
        </div>:
        <div className="w-full h-[70%] overflow-y-auto flex justify-between">
          <div>
            {details.map((detail) => (
              <div key={detail.id} className="ms-5 mt-2 flex items-center gap-2">
                {detail.title && <span className="font-semibold">{detail.title}: </span>}
                <Input
                  type="text"
                  defaultValue={detail.value}
                  className="border-2 text-white"
                />
              </div>
            ))}
          </div>
          <div className="w-40 h-15 flex justify-center items-center">
            <div className="w-[60%] flex justify-center items-center gap-5">
              <Button name={<Check/>} handler={(e)=>{e.preventDefault();setIsEditing(false)}}/>
              <Button name={<CircleX />} handler={(e)=>{e.preventDefault();setIsEditing(false)}}/>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Detail;
