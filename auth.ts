import NextAuth, { Session } from "next-auth";
import GitHub from "@auth/core/providers/github";
import { SessionWithToken } from "@/lib/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    jwt({ token, trigger, session, account }) {
      if (account?.provider === "github") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      let newSession = session as Session as SessionWithToken;
      newSession.accessToken = token.accessToken as string;
      return session;
    },
  },
});
