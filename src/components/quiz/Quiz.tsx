import React from 'react'

export default function Quiz({ children }: { children: string }) {
  return (
    <p className='text-white font-semibold'>{children}</p>
  )
}
