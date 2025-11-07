import { GENERIC_ERROR } from "@/constants/errors";
import { unCodeToken, verifyEmailToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    permission: false,
    message,
  });
}

export async function POST(req: Request) {
  try {
    const { token }: { token: string; } =
      await req.json();
    if (!token) 
      return errorResponse(GENERIC_ERROR);

    const paylod = verifyEmailToken(token)

    if ('error' in paylod)
      return errorResponse("Verification link not found or expired.");
    const decode = unCodeToken(token)

    return NextResponse.json({
      success: true,
      permission: true,
      paylod,
      decode,
      message: "You have permission to edit."
    });
  } catch (err) {
    console.log(err);
    return errorResponse(GENERIC_ERROR);
  }
}