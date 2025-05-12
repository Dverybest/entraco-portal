import { authOptions } from "@/lib/auth"; // or your actual path
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
