import React from 'react'

export default function Loading() {
  return (
    <div className='w-full h-full z-99 bg-black/80 top-0 left-0 
    flex justify-center items-center absolute'>
      <div className='w-10 h-10 border-2 border-t-black 
      border-gray-300 rounded-full animate-spin'></div>
    </div>
  )
}
