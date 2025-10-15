"use server"
import { CHALLENGE_DELETE_SUCCESS, GENERIC_ERROR } from "@/constants/errors";
import { prisma } from "../prisma";


export async function challangeDelete(id: string) {
  try {
    if(!id) return { success: false, message: GENERIC_ERROR }
    await prisma.challenge.delete({
      where: { id }
    })

    return {
      success: true,
      message: CHALLENGE_DELETE_SUCCESS
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR
    }
  }
} 