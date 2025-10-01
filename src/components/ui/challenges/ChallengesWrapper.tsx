import { Children } from '@/app/types/global'
import React from 'react'

export default function ChallengesWrapper({ children }: Children) {
  return (
    <div className='flex flex-wrap gap-2.5 min-w-68'>{children}</div>
  )
}
