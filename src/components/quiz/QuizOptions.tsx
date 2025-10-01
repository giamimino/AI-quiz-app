import React from 'react'

export default function QuizOptions({children}: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-3 gap-2.5'>
      {children}
    </div>
  )
}
