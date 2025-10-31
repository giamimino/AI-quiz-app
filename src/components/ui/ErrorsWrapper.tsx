import { Children } from '@/app/types/global'
import { motion } from 'framer-motion'
import React from 'react'

export default function ErrorsWrapper({ children }: Children) {
  return (
    <motion.div
      className="flex flex-col-reverse gap-2.5 fixed 
      left-1/4 -translate-x-1/2 top-2 z-105 "
    >
      {children}
    </motion.div>
  )
}
