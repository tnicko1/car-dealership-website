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
            profile(profile) {
                const nameParts = profile.name?.split(" ") ?? [];
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(" ");

                return {
                    id: profile.id.toString(),
                    firstName: firstName,
                    lastName: lastName,
                    email: profile.email,
                    image: profile.avatar_url,
                    role: "user",
                };
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    email: profile.email,
                    image: profile.picture,
                    role: "user",
                };
            },
        }),
        Email({
            server: {}, // Required, but empty as we override sendVerificationRequest
            from: "onboarding@resend.dev",
            sendVerificationRequest: async ({ identifier: email, url, provider: { from } }) => {
                const { error } = await resend.emails.send({
                    from: from,
                    to: email,
                    subject: "Sign in to TorqueTown",
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
        async jwt({ token, user, trigger }) {
            // Initial sign in
            if (user?.id) {
                const userInDb = await prisma.user.findUnique({
                    where: { id: user.id },
                });
                if (userInDb) {
                    token.role = userInDb.role;
                    token.username = userInDb.username;
                    token.firstName = userInDb.firstName;
                    token.lastName = userInDb.lastName;
                    token.phone = userInDb.phone;
                    token.image = userInDb.image;
                } else {
                    // This case is for the very first user signing up
                    const userCount = await prisma.user.count();
                    token.role = userCount === 0 ? "admin" : "user";
                }
            }

            // When the session is updated (e.g., profile change), refetch user data
            if (trigger === "update" && token.sub) {
                const userInDb = await prisma.user.findUnique({
                    where: { id: token.sub },
                });
                if (userInDb) {
                    // Update the token with the new data
                    token.username = userInDb.username;
                    token.firstName = userInDb.firstName;
                    token.lastName = userInDb.lastName;
                    token.phone = userInDb.phone;
                    token.image = userInDb.image;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                session.user.role = token.role as string;
                session.user.username = token.username as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.phone = token.phone as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
};
