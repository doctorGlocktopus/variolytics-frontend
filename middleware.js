import { NextResponse } from 'next/server';
import { deleteCookie } from 'cookies-next';
import * as jose from "jose";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;

export async function middleware(request) {
    const jwt = request?.cookies.get("auth");

    if (jwt) {
        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) {
                throw new Error("Invalid JWT format");
            }

            const { payload } = await jose.jwtVerify(jwt, new TextEncoder().encode(secretKey));
            
            if (payload && payload._id) {
                return NextResponse.next();
            }
        } catch (error) {
            console.error("JWT Verification Error: ", error);
            deleteCookie("auth");
        }
    }

    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: ['/dashboard/:path*', '/users/:path*'],
};
