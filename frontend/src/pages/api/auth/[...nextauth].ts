import prisma from "@/lib/prisma/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { Session, TokenSet, User } from "next-auth";
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
    adapter: PrismaAdapter(prisma),
    callbacks: {
      async session({ session, user }: { session: Session; user: User }) {
        const [google] = await prisma.account.findMany({
          where: { userId: user.id, provider: "google" },
        });
        if (
          google.expires_at !== null &&
          google.refresh_token !== null &&
          google.expires_at * 1000 < Date.now()
        ) {
          // If the access token has expired, try to refresh it
          try {
            const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
            const googleClientId = process.env.GOOGLE_CLIENT_ID;
            if (
              googleClientSecret === undefined ||
              googleClientId === undefined
            ) {
              throw new Error("Missing Google client secret or client id");
            }
            // https://accounts.google.com/.well-known/openid-configuration
            // We need the `token_endpoint`.
            const response = await fetch(
              "https://oauth2.googleapis.com/token",
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  client_id: googleClientId,
                  client_secret: googleClientSecret,
                  grant_type: "refresh_token",
                  refresh_token: google.refresh_token,
                }),
                method: "POST",
              }
            );

            const tokens: TokenSet = (await response.json()) as TokenSet;

            if (!response.ok) throw tokens;

            if (
              tokens.expires_in === undefined ||
              tokens.expires_in === null ||
              typeof tokens.expires_in !== "number"
            ) {
              throw new Error("Missing expires_in");
            }
            const newExpiresAt = Math.floor(
              Date.now() / 1000 + tokens.expires_in
            );

            await prisma.account.update({
              data: {
                access_token: tokens.access_token,
                expires_at: newExpiresAt,
                refresh_token: tokens.refresh_token ?? google.refresh_token,
              },
              where: {
                provider_providerAccountId: {
                  provider: "google",
                  providerAccountId: google.providerAccountId,
                },
              },
            });
          } catch (error) {
            console.error("Error refreshing access token", error);
            // The error property will be used client-side to handle the refresh token error
            session.error = "RefreshAccessTokenError";
          }
        }
        return session;
      },
    },
  };
  return options;
};
export default NextAuth(getAuthOptions());
