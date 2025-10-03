import { QuizOptionCreateProps } from '@/app/types/props'
import React from 'react'

export default function QuizOptionCreate({ label }: QuizOptionCreateProps) {
  return (
    <div>{label}</div>
  )
}
