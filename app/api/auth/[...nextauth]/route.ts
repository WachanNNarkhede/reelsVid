import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth({
    ...authOptions,
    callbacks: {
        async jwt({ token, user }) {
            // Add the role to the token if the user exists
            if (user) {
                token.role = user.role; // Assuming `user.role` is provided during authentication
            }
            return token;
        },
        async session({ session, token }) {
            // Add the role to the session
            if (session.user) {
                session.user.role = token.role as "superadmin" | "admin" | "user";
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };