import NextAuth, { AuthOptions } from "next-auth"
import { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";

// Check for environment variables and throw an error if they are missing
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error("Missing GitHub OAuth environment variables");
}

// This is the single configuration object for NextAuth.js v4
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    // We use a JWT session strategy to make middleware work correctly
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // This callback adds the user's role to the JWT
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        // This callback adds the role from the JWT to the session object
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
