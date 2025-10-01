import React from 'react'

export default function QuizWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-2.5 w-full items-center justify-center'>
      {children}
    </div>
  )
}
