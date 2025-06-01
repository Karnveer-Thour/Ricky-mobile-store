import React from "react";

function layout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      Navbar
      {children}
    </div>
  );
}

export default layout;
