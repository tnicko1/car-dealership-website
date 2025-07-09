import NextAuth, { type DefaultSession } from "next-auth";

// This file extends the default types for NextAuth.js
// It tells TypeScript that our user object in the session will also have an 'id' and a 'role'.

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's unique identifier. */
            id: string;
            /** The user's role (e.g., 'admin' or 'user'). */
            role: string;
        } & DefaultSession["user"];
    }

    /**
     * The User object returned from the database.
     */
    interface User {
        role: string;
    }
}
