"use client";
import Navbar from "@/components/navbar/navbar";
import classNames from "classnames";
import React, { useState } from "react";

function layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
   const [isOpen, setIsOpen] = useState(false);
    return (
       <div className={`flex`}>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen}/> 
      <div className={classNames("flex-1 h-auto overflow-y-auto p-5 bg-gray-100 transition-all duration-300",isOpen?"md:ml-64" : "md:ml-20")}>
        {children}
      </div>
      </div>
    );
}

export default layout;
