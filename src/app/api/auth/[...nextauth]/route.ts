import NextAuth, { AuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";

// Check for environment variables and throw an error if they are missing
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error("Missing GitHub OAuth environment variables");
}

// The 'export' keyword has been removed from this line.
// This object is now only used within this file and not exported.
const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
