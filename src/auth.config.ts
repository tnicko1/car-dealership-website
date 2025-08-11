import { AuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Email from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";
import { Resend } from "resend";

// Check for environment variables and throw an error if they are missing
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.RESEND_API_KEY) {
    throw new Error("Missing environment variables for authentication");
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
        Email({
            server: {}, // Required, but empty as we override sendVerificationRequest
            from: "onboarding@resend.dev",
            sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
                const { data, error } = await resend.emails.send({
                    from: from,
                    to: email,
                    subject: "Sign in to Your Car Dealership",
                    html: `<p>Click the magic link to sign in: <a href="${url}"><strong>Sign in</strong></a></p>`,
                });

                if (error) {
                    console.error("Resend error:", error);
                    throw new Error("Failed to send verification email.");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user?.id) {
                const userInDb = await prisma.user.findUnique({
                    where: { id: user.id },
                });
                if (userInDb) {
                    token.role = userInDb.role;
                } else {
                    const userCount = await prisma.user.count();
                    token.role = userCount === 0 ? "admin" : "user";
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                if (token.sub) {
                    session.user.id = token.sub;
                }
            }
            return session;
        },
    },
};
