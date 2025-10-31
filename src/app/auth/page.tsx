"use client"
import AuthWrapper from '@/components/ui/auth/auth'
import SignInButton from '@/components/ui/auth/sign-in-button'
import React from 'react'

export default function AuthPage() {
  return (
    <div>
      <AuthWrapper>
        <SignInButton provider='github' />
      </AuthWrapper>
    </div>
  )
}
