import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function getTest() {
  const filePath = path.join(process.cwd(), "prisma/sql/getTest.sql");

  const query = fs.readFileSync(filePath, "utf8");

  const result = await prisma.$queryRawUnsafe(query);

  console.log(result);
  return result;
}