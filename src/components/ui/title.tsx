import { Children } from '@/app/types/global'
import React from 'react'

export default function Title({ children }: Children) {
  return (
    <h1 className='text-lg font-semibold text-white'>
      {(children as string)}
    </h1>
  )
}
