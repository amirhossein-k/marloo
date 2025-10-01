import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/register", "/login"], // مسیرهایی که نیاز به لاگین دارند
};


export async function middleware(request: NextRequest) {


    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    const { pathname } = request.nextUrl
    const publicPaths = ["/login", "/register"];



    // مسیرهای عمومی → اگر لاگین هست، redirect به پروفایل یا داشبورد
    if (publicPaths.includes(pathname)) {
        if (token?.user) {
            const redirectPath = token.user.admin ? "/dashboard" : "/profile";
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        return NextResponse.next();
    }

    // مسیرهای خصوصی → اگر لاگین نیست، redirect به login
    if (!token?.user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // مسیر داشبورد → فقط admin
    if (pathname.startsWith("/dashboard") && !token.user.admin) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    // مسیر پروفایل → کاربر عادی نباید به پروفایل دیگران یا مسیر admin دسترسی داشته باشد
    if (pathname.startsWith("/profile") && token.user.admin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }


    return NextResponse.next();
}