import React from "react";

import { ReactNode } from "react";

function Maincontainer({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('/assets/images/loginBackground.jpg')] bg-cover bg-center">
      {children}
    </div>
  );
}

export default Maincontainer;
