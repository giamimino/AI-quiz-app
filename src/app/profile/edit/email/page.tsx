"use client";
import { EditWrapper, FormWrapper } from "@/components/edits";
import DefaultButton from "@/components/ui/default-button";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Loading from "@/components/ui/loading/Loading";
import { GENERIC_ERROR } from "@/constants/errors";
import { useValidateEmail } from "@/hooks/useValidateEmail";
import { useUserStore } from "@/zustand/useUserStore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EmailEditPage() {
  const router = useRouter();
  const [email, setEmail] = useState<{
    oldEmail: string;
    newEmail: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const [permission, setPermission] = useState(false);
  const validateEmail = useValidateEmail(email?.newEmail as string);
  const user = useUserStore((state) => state.user);

  const handleUpdateEmail = async () => {
    if (!validateEmail.validation || !permission) return;

    fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user?.name,
        email: validateEmail.email,
        userId: user?.id,
        redirect: "verify/email/",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMessages((prev) => [
            ...prev,
            data.error ?? data.id
              ? "A verification link has been sent to your email."
              : "",
          ]);
        }
      });
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const userId = url.searchParams.get("id") as string | undefined | null;
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/send/verify/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setMessages((prev) => [...prev, data.message]);
        setPermission(data.permission);
        if (data.success) {
          setEmail({
            oldEmail: String(data.payload.email) ?? "",
            newEmail: "",
          });
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;
  if (!email)
    return (
      <div className="text-white p-5 flex gap-1">
        <AnimatePresence>
          {messages.length > 0 && (
            <ErrorsWrapper>
              {messages.map((c, idx) => (
                <Error
                  key={`${c}-${idx}`}
                  error={`${c} 0${idx}`}
                  handleClose={() => setMessages((prev) => prev.splice(idx, 1))}
                />
              ))}
            </ErrorsWrapper>
          )}
        </AnimatePresence>
        <p>{GENERIC_ERROR}</p>
        <button
          onClick={() => router.push("/profile/edit")}
          className="text-blue-600 cursor-pointer underline hover:text-blue-800"
        >
          Back
        </button>
      </div>
    );
  return (
    <div className="flex justify-center items-center p-5">
      <AnimatePresence>
        {messages.length > 0 && (
          <ErrorsWrapper>
            {messages.map((c, idx) => (
              <Error
                key={`${c}-${idx}`}
                error={`${c} 0${idx}`}
                handleClose={() => setMessages((prev) => prev.splice(idx, 1))}
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <div>
        <EditWrapper>
          <div className="flex gap-1 relative text-white">
            <h1>old email:</h1>
            <p>{email.oldEmail}</p>
          </div>
          <div className="w-full">
            {permission && (
              <FormWrapper
                label="new email"
                type="input"
                value={email.newEmail}
                onChange={(e) =>
                  setEmail((prev) => (prev ? { ...prev, newEmail: e } : prev))
                }
                wFull
              />
            )}
          </div>
          {!validateEmail.validation && email.newEmail !== "" && (
            <p className="text-red-500 py-1.5">
              Please enter a valid Gmail address.
            </p>
          )}
          <DefaultButton wFit label="update" mt={1.5} onClick={handleUpdateEmail} />
        </EditWrapper>
      </div>
    </div>
  );
}
