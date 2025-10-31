import React from 'react'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1 absolute top-1/2 left-1/2 -translate-1/2'>
      {children}
    </div>
  )
}
