import { PrismaAdapter } from "@auth/prisma-adapter"
import { randomString } from "./random-string"

export const CustomAdapter = (prisma: any) => {
  const adapter = PrismaAdapter(prisma)
  return {
    ...adapter,
    async createUser(data: any) {
      const modifiedData = {
        ...data,
        username: data.name ? `${(data.name as string).replace(" ", "-")}-${randomString(3)}` : `Anonymous-${randomString(7)}`
      };
      if(!adapter.createUser) throw new Error("createUser is undefined")
      return adapter.createUser(modifiedData)
    }
  }
}