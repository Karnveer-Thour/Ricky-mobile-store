import React from 'react'

function Formcontainer({children,className}) {
  return (
    <div className={` w-full bg-white rounded-lg shadow-lg ${className}`}>
        {children}
    </div>
  )
}

export default Formcontainer