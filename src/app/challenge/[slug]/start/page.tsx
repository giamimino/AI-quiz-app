import { ChallengePageProps } from '@/app/types/props'
import React, { use } from 'react'

export default function ChallengeStartPage({ params }: ChallengePageProps) {
  const {slug} = use(params)
  return (
    <div>{slug}</div>
  )
}
