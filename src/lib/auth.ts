import NextAuth from "next-auth";
import { prisma } from "./prisma";
import GitHub from "next-auth/providers/github";
import { CustomAdapter } from "@/utils/CustomAdapter";
import Discord from "next-auth/providers/discord";
// import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: CustomAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.sub) return session;

      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { username: true },
      });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          username: dbUser?.username,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
});
