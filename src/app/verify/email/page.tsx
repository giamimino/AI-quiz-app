"use client"
import Loading from '@/components/ui/loading/Loading'
import { useUserStore } from '@/zustand/useUserStore'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function VerifyPage() {
  const router = useRouter()
  const setUser = useUserStore(state => state.setUser)

  useEffect(() => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get("token")
    const id = url.searchParams.get("id")
    if(!token) {
      router.push("/profile/edit")
      return
    }

    (async () => {
      const res = await fetch("/api/send/verify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId: id ?? null })
      })
      const data = await res.json()

      if(data.success) {
        setUser(data.user)
        router.push("/profile/edit")
      }
    })();
  }, [])
  
  return (
    <div>
      <Loading />
    </div>
  )
}