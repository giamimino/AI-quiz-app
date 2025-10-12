import React, { useCallback, useState } from 'react'
import DefaultButton from './ui/default-button'

const limit = 50
export default function Counter({ ref, currentLenght }: { currentLenght: number, ref: React.RefObject<HTMLHeadingElement | null> | null }) {
  const [count, setCount] = useState((limit - currentLenght) === 0 ? 0 : 1)
  const increase = useCallback(() => setCount(c => c < (limit - currentLenght) ? c + 1 : c), []);
  const decrease = useCallback(() => setCount(c => c > 1 ? c - 1 : c), []);
  return (
    <div className='flex gap-2.5 select-none'>
      <DefaultButton
        icon='mingcute:add-fill'
        wFit xSmall
        onClick={increase}
      />
      <h1 ref={ref}>{count}</h1>
      <DefaultButton
        icon='tabler:minus'
        wFit xSmall
        onClick={decrease}
      />
    </div>
  )
}
