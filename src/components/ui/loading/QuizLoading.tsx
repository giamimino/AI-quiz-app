import React from 'react'

export default function QuizLoading() {
  const lenght = [1, 2, 3, 4, 5, 6]
  return (
    <div className='flex flex-col gap-4 w-full justify-center items-center'>
      <div className='w-80 h-8 bg-gray-600 animate-pulse'></div>
      <div className='grid grid-cols-3 gap-2.5'>
        {lenght.map(
          (l) => (
            <div key={l} className='py-6 px-8 bg-gray-600 animate-pulse'></div>
          )
        )}
      </div>
    </div>
  )
}
