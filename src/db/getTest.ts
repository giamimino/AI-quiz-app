import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function getTest() {
  // Find the SQL file in your project
  const filePath = path.join(process.cwd(), "prisma/sql/getTest.sql");

  // Read its contents (basically copy-paste it as text)
  const query = fs.readFileSync(filePath, "utf8");

  // Tell Prisma to run it
  const result = await prisma.$queryRawUnsafe(query);

  console.log(result);
  return result;
}