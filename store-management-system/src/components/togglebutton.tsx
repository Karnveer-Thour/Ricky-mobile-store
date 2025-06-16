import React, { useState } from 'react'
import { boolean } from 'yup'

interface toggleButtonProps{
    isDark?:boolean
    activeLabel:string,
    inactiveLabel:string,
    handler:Function,
    formProp?:object,
}

function ToggleButton({isDark=false,activeLabel,inactiveLabel,handler,formProp={}}:toggleButtonProps) {
    const [isActive,setIsActive]=useState(false);
  return (
     <div className="flex items-center justify-center max-lg:hidden max-md:ms-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={isActive}
              onChange={()=>{handler();setIsActive(prev=>!prev)}}
              {...formProp}
            />
            <div
              className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              } ${isDark ? "border-2 border-white p-3" : ""}`}
            ></div>
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            ></div>
          </label>
          <span className="ml-3 text-black font-bold text-sm">
        {isActive ? activeLabel : inactiveLabel}
      </span>
        </div>
  )
}

export default ToggleButton