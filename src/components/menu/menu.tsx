"use client"
import React, { useRef, useState } from 'react'
import MenuButton from './menu-button'
import { AnimatePresence } from 'framer-motion'
import MenuOpen from './menu-open'
import SearchButton from './search-button'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  return (
    <div className='w-full h-fit flex justify-center z-100 p-4 relative'>
      <SearchButton onClick={() => router.push("/challenge/search")} />
      <button onClick={() => router.back()} className='text-white p-1 border border-white cursor-pointer z-102 rounded-lg absolute top-10 left-2'>
        <Icon icon={"pajamas:go-back"} />
      </button>
      <MenuButton
        ref={buttonRef}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpen={() => setMenuOpen(true)}
      />
      <AnimatePresence mode="wait">
        {menuOpen && (
          <MenuOpen closeMenu={() => setMenuOpen(false)} buttonRef={buttonRef} />
        )}
      </AnimatePresence>
    </div>
  )
}
