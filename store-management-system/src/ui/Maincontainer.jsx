import React from 'react';

function Maincontainer({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-radial from-gray-600 to-white">
      {children}
    </div>
  );
}

export default Maincontainer;
