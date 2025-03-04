import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        if (req.nextUrl.pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    },
    {
        callbacks: {
            //removed token from authorized and return
            authorized: ({ req }) =>{
             const { pathname } = req.nextUrl;
             if(
                // Allow auth realted paths
                pathname.startsWith("/api/auth") ||
                pathname.startsWith("/login") ||
                pathname.startsWith("/register") ||
                pathname.startsWith("/upload")

             ){
                return true
             }
             //public routes
             if(pathname === "/" || pathname.startsWith("/api/video")) {
                 return true
             }
             return true
            } ,
        },
    }
);

export const config = {
     matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"] ,
    };