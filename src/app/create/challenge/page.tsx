"use client"
import ChoiceWrapper from '@/components/common/create/challenge/ChoiceWrapper'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CreateChallenge() {
  const router = useRouter()
  
  return (
    <div className='p-12 w-full h-full'>
      <ChoiceWrapper onChoice={(choice: string) => router.push(`/create/challenge/${choice.toLowerCase()}`)} />
    </div>
  )
}

