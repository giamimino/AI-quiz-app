import { EmailTemplate } from "@/components/email-template";
import { auth } from "@/lib/auth";
import { generateEmailToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, userId, redirect }: { name: string; email: string, userId?: string | null, redirect: string } = await req.json();
    const session = userId ? null : await auth()
    const effectiveUserId = userId ?? session?.user?.id
    
    const token = generateEmailToken(email)

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}${redirect}/?token=${token}&id=${effectiveUserId}`
    
    const { data, error } = await resend.emails.send({
      from: "ai.quiz.app@greenmindmail.shop",
      to: email,
      subject: "Ai Quiz app verify",
      html: `
        <div>
          <h1>Hello, ${name}!</h1>
          <h3>Link: ${verifyUrl}</h3>
          <p>Expires in 15 minutes</p>
        </div>`,
      });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
