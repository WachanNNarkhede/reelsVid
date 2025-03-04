import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "superadmin" | "admin" | "user"; // Add roles here
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: "superadmin" | "admin" | "user"; // Add roles here
    }
}