"use client"
import DefaultInput from '@/components/ui/default-input'
import React, { useState } from 'react'

export default function ManualyCreateChallenge() {
  const [values, setValues] = useState(Array(0).fill(""))
  const handleChange = (idx: number, val: string) => {
    const newValues = [...values]
    newValues[idx] = val
    setValues(newValues)
  }

  return (
    <div>
      {values.map((val, idx) => (
        <DefaultInput
          key={idx}
          value={val}
          onChange={(e) => handleChange(idx, e.target.value)}
        />
      ))}
      <button onClick={() => setValues(prev => [...prev, ""])}>Add new Value</button>
    </div>
  )
}
