import prisma from "@/lib/prisma/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    error?: "RefreshAccessTokenError";
  }
}

export const getAuthOptions = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl === undefined) {
    throw new Error("Missing DATABASE_URL");
  }

  // Provider-specific options:
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (googleClientSecret === undefined || googleClientId === undefined) {
    throw new Error("Missing Google client secret or client id");
  }
  const options = {
    providers: [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      }),
    ],
    pages: {
      signIn: "/auth/signin",
    },
    session: {
      strategy: "jwt" as SessionStrategy,
    },
    jwt: {
      // The maximum age of the NextAuth.js issued JWT in seconds.
      // Defaults to `session.maxAge`.
      maxAge: 60 * 60 * 24 * 30,
    },
    adapter: PrismaAdapter(prisma),
  };
  return options;
};
export default NextAuth(getAuthOptions());
