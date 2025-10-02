import { CreateChallangeProps } from '@/app/types/props'
import DefaultButton from '@/components/ui/default-button';
import React from 'react'

export default function ChoiceWrapper({ onChoice }: CreateChallangeProps) {
  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement

    if(target instanceof HTMLButtonElement) {
      const choice = target.name
      if(!choice) return;
      onChoice(choice)
    }
  }
  
  return (
    <div className='w-full h-30 
    z-99 flex items-center flex-col gap-2.5 [&_p]:text-white'>
      <p>Which you prefer create challenge using?</p>
      <div className='flex items-center gap-2'
      onClick={handleClick}>
        <DefaultButton
          label='ai'
          name='ai'
        />
        <p className='opacity-60 select-none'>or</p>
        <DefaultButton
          label='manual'
          name='manual'
        />
      </div>
    </div>
  )
}
