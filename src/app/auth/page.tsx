"use client"
import AuthWrapper from '@/components/ui/auth/auth'
import SignInButton from '@/components/ui/auth/sign-in-button'
import React from 'react'

export default function AuthPage() {
  return (
    <div>
      <AuthWrapper>
        <SignInButton provider='github' />
        <h1 className='text-center text-white/70'>or</h1>
        <SignInButton provider='discord' />
      </AuthWrapper>
    </div>
  )
}
