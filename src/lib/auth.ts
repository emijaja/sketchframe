import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    Google({
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    }),
    GitHub({
      clientId: getRequiredEnv("GITHUB_CLIENT_ID"),
      clientSecret: getRequiredEnv("GITHUB_CLIENT_SECRET"),
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
})
