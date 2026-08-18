import React, { ReactNode } from "react";

function Maincontainer({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#07070f] text-[#e8ebf0] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#00cfff] selection:text-[#07070f]">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-[#00cfff]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 right-1/4 w-[600px] h-[400px] bg-[#8b5cf6]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Grid line pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

export default Maincontainer;
