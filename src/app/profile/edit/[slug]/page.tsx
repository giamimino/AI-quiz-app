"use client";
import { ChallengeEditProps } from "@/app/types/props";
import { EditWrapper, FormWrapper } from "@/components/edits";
import DefaultButton from "@/components/ui/default-button";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Loading from "@/components/ui/loading/Loading";
import Title from "@/components/ui/title";
import { CHALLENGE_ACCESS_ERROR, GENERIC_ERROR } from "@/constants/errors";
import {
  requestChallengeForEdit,
  updateChallenge,
} from "@/lib/actions/actions";
import { useUserStore } from "@/zustand/useUserStore";
import { $Enums } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const editableValues = [
  [
    { label: "Title", type: "input" },
    { label: "Topic", type: "input" },
    { label: "Slug", type: "input" },
  ],
  { label: "Description", type: "textarea" },
];

type ChallengeType = {
  slug: string;
  title: string;
  description: string;
  topic: string;
};

type typeType = "input" | "textarea";

export default function ChallengeEditPage({ params }: ChallengeEditProps) {
  const { slug } = React.use(params);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useUserStore((state) => state.user?.id) ?? null;
  const [challenge, setChallenge] = useState<{
    slug: string;
    id: string;
    type: $Enums.ChallengeType;
    title: string;
    description: string | null;
    topic: string | null;
  } | null>(null);

  const challengeId = useRef<string | null>(null);
  const router = useRouter();

  const handleChallengeUpdate = async () => {
    if (!challenge) return;
    const res = await updateChallenge({
      challengeId: challenge.id,
      challenge: { ...challenge } as ChallengeType,
    });

    setMessages((prev) => [...prev, res.message]);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    challengeId.current = id;

    (async () => {
      const res = await requestChallengeForEdit({
        slug,
        ...(id ? { id } : {}),
        ...(userId ? { userId } : {}),
      });
      if (res.success && res.challenge) {
        setChallenge(res.challenge);
      } else {
        setMessages((prev) => [...prev, res.message ?? GENERIC_ERROR]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loading />;
  if (!challenge)
    return (
      <div className="flex gap-1">
        <p className="text-white/70">{CHALLENGE_ACCESS_ERROR}</p>
        <button
          className="text-blue-600 cursor-pointer underline hover:text-blue-800"
          onClick={() => router.back()}
        >
          Back?
        </button>
      </div>
    );
  return (
    <div className="p-5">
      <AnimatePresence>
        {messages.length > 0 && (
          <ErrorsWrapper>
            {messages.map((c, idx) => (
              <Error
                key={`${c}-${idx}`}
                error={`${c} ${(idx + 1).toFixed().padStart(2, "0")}`}
                handleClose={() =>
                  setMessages((prev) =>
                    prev.filter((_, index) => index !== idx)
                  )
                }
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <EditWrapper>
        <Title>Your Challenge</Title>
        {editableValues.map((ed) =>
          Array.isArray(ed) ? (
            <div key={JSON.stringify(ed)} className="flex gap-2.5 flex-wrap">
              {ed.map(({ label, type }) => {
                const key = label.toLowerCase() as keyof typeof challenge;
                return (
                  <FormWrapper
                    key={label}
                    label={label}
                    type={type as typeType}
                    value={(challenge?.[key] ?? "") as string}
                    onChange={(value) =>
                      setChallenge((prev) =>
                        prev
                          ? {
                              ...prev,
                              [key]: value,
                            }
                          : prev
                      )
                    }
                  />
                );
              })}
            </div>
          ) : (
            <FormWrapper
              key={ed.label}
              type={ed.type as typeType}
              label={ed.label}
              value={
                (challenge?.[
                  ed.label.toLowerCase() as keyof typeof challenge
                ] ?? "") as string
              }
              onChange={(value) =>
                setChallenge((prev) =>
                  prev
                    ? {
                        ...prev,
                        [ed.label.toLowerCase()]: value,
                      }
                    : prev
                )
              }
            />
          )
        )}
      </EditWrapper>
      <div className="mt-2">
        {<DefaultButton label="update" onClick={handleChallengeUpdate} />}
      </div>
      <p className="text-white/60 mt-2">
        Unfortunately, challenge questions can’t be edited because participants
        have already answered them. Editing would cause data loss. You can
        either delete the challenge and create a new one, or leave it as it is.
      </p>
    </div>
  );
}
