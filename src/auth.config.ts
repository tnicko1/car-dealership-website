import { AuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";

// Check for environment variables and throw an error if they are missing
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.RESEND_API_KEY) {
    throw new Error("Missing environment variables for authentication");
}

// This is the single configuration object for NextAuth.js v4.
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GitHub({
            // The '!' tells TypeScript that we are certain these environment variables exist.
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Resend({
            apiKey: process.env.RESEND_API_KEY!,
            from: 'onboarding@resend.dev',
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
};
