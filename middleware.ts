import { NextApiRequest, NextApiResponse } from "next";
import withAuth from "next-auth/middleware";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Redirect root path to /dashboard
        if (req.nextUrl.pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow auth-related paths
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/login") ||
                    pathname.startsWith("/register")
                ) {
                    return true;
                }

                // Allow public routes
                if (pathname === "/" || pathname.startsWith("/api/video")) {
                    return true;
                }

                // Check if the user is authenticated
                if (!token) {
                    return false;
                }

                // Role-based access control
                if (pathname.startsWith("/superadmindashboard")) {
                    
                    return token.role === "superadmin"; // Only superadmin can access
                }

                if (pathname.startsWith("/upload")) {
                    return token.role === "admin" || token.role === "superadmin"; // Admin and superadmin can access
                }

                // Default: Allow access to other routes for all authenticated users
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};

export const requireRole = (role: "superadmin" | "admin" | "user") => {
    return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
        const session = await getSession({ req });

        if (!session || session.user.role !== role) {
            return res.status(403).json({ message: "Access denied" });
        }

        next(); 
    };
};