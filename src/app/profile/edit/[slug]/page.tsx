import { ChallengeEditProps } from '@/app/types/props'
import React from 'react'

export default function ChallengeEditPage({ params }: ChallengeEditProps) {
  const { slug } = React.use(params)
  return (
    <div>{slug}</div>
  )
}
