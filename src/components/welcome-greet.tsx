"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
export default function WelcomeGreet() {
  const [show, setShow] = useState(true)
  const word = "Welcome to Quiz App."
  const words = word.split(" ")
  const duration = 0.6

  useEffect(() => {
    const total = duration + (words.length / 10) + 0.4
    const timer = setTimeout(() => setShow(false), total * 1000)
    return () => clearTimeout(timer)
  }, [word.length])

  return (
    <>
      {show && (
          <motion.div
            key={"Welcome"}
            className='glow text-5xl fixed top-1/2 left-1/2 -translate-1/2 flex gap-2.5
            w-full h-full bg-black justify-center items-center z-999 text-white'
          >
            {words.map((w, idx) => (
              <motion.span
                key={`w-${idx}`}
                initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)"}}
                transition={{ duration: duration , ease: [0.54, 0.53, 0.39, 1.40], delay: idx / 10 }}
                className='block'
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
      )}
    </>
  )
}
