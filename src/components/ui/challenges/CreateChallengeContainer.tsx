import { Children } from '@/app/types/global'
import React from 'react'

export default function CreateChallengeContainer({ children }: Children) {
  return (
    <div className='flex flex-col gap-2.5'>
      {children}
    </div>
  )
}
