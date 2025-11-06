"use client";
import { EditWrapper, FormWrapper } from "@/components/edits";
import Loading from "@/components/ui/loading/Loading";
import { GENERIC_ERROR } from "@/constants/errors";
import { unCodeToken } from "@/utils/jwt";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EmailEditPage() {
  const router = useRouter();
  const [email, setEmail] = useState<{
    oldEmail: string;
    newEmail: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const userId = url.searchParams.get("id") as string | undefined | null;
    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = unCodeToken(token) as {
      email: string;
      iat: number;
      exp: number;
    };

    if (!decoded) {
      setLoading(false);
      return;
    }
    
    setEmail({ oldEmail: String(decoded.email) ?? "", newEmail: "" });
    setLoading(false);
    // url.searchParams.delete("token");
    // url.searchParams.delete("id");
    // window.history.replaceState({}, "", url.toString());
  }, []);

  console.log(email);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;
  if (!email)
    return (
      <div className="text-white p-5 flex gap-1">
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
      <div>
        <EditWrapper>
          <div className="flex gap-1 relative text-white">
            <h1>old email:</h1>
            <p>{email.oldEmail}</p>
          </div>
          <FormWrapper
            label="new email"
            type="input"
            value={email.newEmail}
            onChange={(e) =>
              setEmail((prev) => (prev ? { ...prev, newEmail: e } : prev))
            }
            wFull
          />
        </EditWrapper>
      </div>
    </div>
  );
}
