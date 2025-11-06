import { GENERIC_ERROR } from "@/constants/errors";
import { verifyEmailToken } from "@/utils/jwt";
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

    const paylod = verifyEmailToken(token);

    if (!paylod)
      return errorResponse("Verification link not found or expired.");

    return NextResponse.json({
      success: true,
      permission: true,
      paylod,
      message: "You have permission to edit."
    });
  } catch (err) {
    console.log(err);
    return errorResponse(GENERIC_ERROR);
  }
}