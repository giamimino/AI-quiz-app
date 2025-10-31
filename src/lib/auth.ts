import NextAuth from "next-auth"
import { prisma } from "./prisma"
import GitHub from "next-auth/providers/github"
import { CustomAdapter } from "@/utils/CustomAdapter";
// import Google from "next-auth/providers/google";
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: CustomAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      }
    },
  },
  secret: process.env.AUTH_SECRET,
});