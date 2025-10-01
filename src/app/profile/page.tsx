'use client'
import Challenge from "@/components/ui/challenges/Challenge";
import ChallengesWrapper from "@/components/ui/challenges/ChallengesWrapper";
import CostumnChallenge from "@/components/ui/challenges/CostumChallenge";
import ProfileContainer from "@/components/ui/ProfileContainer";
import { useUserStore } from "@/zustand/useUserStore";
import React, { useEffect }  from "react";
import data from "@/data/challenges/challenges.json" 
import { delay } from "@/utils/delay";
import ProfileWrapperLoading from "@/components/ui/loading/ProfileWrapperLoding";
import dynamic from "next/dynamic";
const ProfileWrapper = dynamic(() =>
  delay(350).then(() => import("@/components/ui/ProfileWrapper")), {
    loading: () => <ProfileWrapperLoading col gap={0.5} />,
    ssr: false
  }
)

export default function ProfilePage() {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    fetch('/api/user/get')
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setUser(data.user)
      }
    })
  }, [])
  return (
    <div className="text-white p-8">
      <ProfileContainer flexWrap>
        <ProfileWrapper gap={0.5} col >
          <img src={user?.image} width={48} height={48} className="rounded-full mb-2.5" />
          {user && Object.entries(user).map(([key, value]) => (
            key !== "image" && key !== "id" && <p className="text-nowrap" key={key + "-" + value}>{key}: {String(value)}</p>
          ))}
        </ProfileWrapper>
        <ProfileWrapper hFit col gap={2}>
          <h1 className="text-lg font-semibold">Challenges</h1>
          <ChallengesWrapper>
            {data.map(
              (c) => (
                <Challenge key={c} challenge={c} />
              )
            )}
          </ChallengesWrapper>
          <CostumnChallenge />
        </ProfileWrapper>
        <ProfileWrapper hFit col xCenter gap={2.5}>
          <img src={user?.image} width={64} height={64} className="rounded-xl" />
          <button className="cursor-pointer">Change a picture</button>
        </ProfileWrapper>
      </ProfileContainer>
    </div>
  )
}