"use client"
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function StatisticPage() {
  const router = useRouter()
  return (
    <div>
      <button onClick={() => router.push("statistic/history")} className='text-white p-1 border border-white cursor-pointer z-102 rounded-lg absolute top-2 right-2'>
        <Icon icon={"material-symbols:history"} />
      </button>
    </div>
  )
}
