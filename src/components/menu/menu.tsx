"use client"
import React, { useRef, useState } from 'react'
import MenuButton from './menu-button'
import { AnimatePresence } from 'framer-motion'
import MenuOpen from './menu-open'

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <div className='w-full h-fit flex justify-center p-4 relative'>
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
