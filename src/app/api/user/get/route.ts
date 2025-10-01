import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({
      success: true,
      user: session?.user
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}