import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        // @ts-ignore
        session.user.role = token.role as string
        // @ts-ignore
        session.user.cavernottiBalance = token.cavernottiBalance as number
      }
      return session
    },
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id
            // @ts-ignore
            token.role = user.role
            // @ts-ignore
            token.cavernottiBalance = user.cavernottiBalance
        }
        return token
    }
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
