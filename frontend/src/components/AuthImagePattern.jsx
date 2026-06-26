import React from 'react'


// here we are deconstructing where insted of using props we are directly using title and subtitle
const AuthImagePattern = ({title,subtitle}) => {
  return (
    //outer container here it is hidden in small screens i.e it is for large screens only
    <div className='hidden lg:flex items-center justify-center bg-base-200 p-12'>
        
        {/* inner container */}
      <div className="max-w-md text-center">
        {/* creating grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
            {/* here it creates array with 9 empty slots */}
            {[...Array(9)].map((_,i)=>(
                <div key={i} className={`aspect-square rounded-2xl bg-primary/10 ${
                    i % 2 === 0 ? "animate-pulse" : ""           //here if the index is even animate pulse is used
                }`}
                />
            ))}

        </div>
        <h2 className='text-2xl font-bold mb-4'>{title}</h2>
        <p className='text-base-content/60'>{subtitle}</p>
      </div>
    </div>
  )
}

export default AuthImagePattern
