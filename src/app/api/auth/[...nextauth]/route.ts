import NextAuth from "next-auth"
import { authOptions } from "@/auth.config"; // Import from the new central file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
