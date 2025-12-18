"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/useUserStore";
import Loading from "./ui/loading/Loading";

export function UserBootstrap({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) return;
    setLoading(true)
    fetch("/api/user/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      });
      setLoading(false)
  }, [user]);
  if(loading) return <Loading />
  return children;
}
