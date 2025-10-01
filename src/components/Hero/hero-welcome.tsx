import React from 'react'

export default function HeroWelcome({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full mt-2 flex justify-center p-2'>
      {children}
    </div>
  )
}
