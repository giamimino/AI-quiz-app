"use client";
import { EditWrapper, FormWrapper } from "@/components/edits";
import DefaultButton from "@/components/ui/default-button";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Title from "@/components/ui/title";
import { requestUserForEdit } from "@/lib/actions/actions";
import { useUserStore } from "@/zustand/useUserStore";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import months from "@/data/months.json";
import Loading from "@/components/ui/loading/Loading";
import { useRouter } from "next/navigation";

const editableValues = [
  { label: "Name", type: "input" },
  { label: "Username", type: "input" },
  { label: "birthday", type: "input/date" },
];

export default function EditPage() {
  const userId = useUserStore((state) => state.user?.id);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestedValue, setSuggestedValue] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [user, setUser] = useState<{
    birthday: Date | null;
    name: string;
    username: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }>();
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const birthday = new Date(formData.get("birthday") as string);
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, birthday }),
    });
    const data = await res.json();

    if (!data.success) {
      if (data.suggested) {
        setSuggestedValue({
          label: "Username",
          value: data.suggested.username,
        });
      }
    }
    setMessages((prev) => [...prev, data.message]);
    setLoading(false)
  };

  useEffect(() => {
    requestUserForEdit({ userId }).then((res) => {
      if (res.success) {
        setUser(res.user);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;
  if (!user)
    return (
      <div className="p-5">
        <p>
          no user found.{" "}
          <button
            onClick={() => router.push("/profile")}
            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          >
            Back
          </button>
        </p>
      </div>
    );

  return (
    <div className="py-5 px-2 flex flex-col gap-2.5">
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
      <EditWrapper type="form" onSubmit={handleUpdateProfile}>
        <Title>Your profile</Title>
        <EditWrapper className="flex flex-wrap gap-2.5">
          {editableValues.map((ed) =>
            ed.label === "birthday" && user?.birthday ? (
              <div className={"flex flex-col gap-1 relative"} key={ed.label}>
                <h1 className="text-white">{ed.label}</h1>
                <p className="text-white font-medium max-w-45 p-1 border-1 border-white/7 rounded-md">{`${user.birthday?.getDate()} ${
                  months[user.birthday?.getMonth() as number]
                } ${user.birthday?.getFullYear()}`}</p>
              </div>
            ) : (
              <FormWrapper
                key={ed.label}
                label={ed.label}
                name={ed.label.toLowerCase()}
                {...(suggestedValue && suggestedValue.label === ed.label
                  ? {
                      suggestedValue: suggestedValue.value,
                      clearSugestedValue: () => setSuggestedValue(null),
                    }
                  : {})}
                value={
                  (user?.[ed.label.toLowerCase() as keyof typeof user] ??
                    "") as string
                }
                onChange={(e) =>
                  setUser((prev) =>
                    prev
                      ? {
                          ...prev,
                          [ed.label.toLowerCase() as keyof typeof user]: e,
                        }
                      : prev
                  )
                }
                type={ed.type.split("/")[0] as "input" | "textarea"}
                as={ed.type.split("/")[1]}
              />
            )
          )}
        </EditWrapper>
        <div className="pt-2">
          <DefaultButton type="submit" wFit label="update" />
        </div>
      </EditWrapper>
      <EditWrapper>
        <Title>Email</Title>
        <FormWrapper
          label="Email"
          value={user.email}
          onChange={(e) => console.log(e)}
          type="input"
        />
      </EditWrapper>
    </div>
  );
}
