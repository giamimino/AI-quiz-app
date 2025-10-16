import React from 'react'

export default function ChallengeLoading() {
  return (
    <div className='w-full p-4 flex flex-col bg-[#222222] rounded-lg
    gap-2.5'>
      <div className='w-1/4 h-6 bg-gray-600 animate-pulse'></div>
      <div className='w-2/4 h-20 bg-gray-600 animate-pulse'></div>
      <div className='w-3/4 h-12 bg-gray-600 animate-pulse'></div>
    </div>
  )
}
