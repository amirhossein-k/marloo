// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db as prisma } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      id: "phone-otp",
      name: "phone-otp",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" }, // فقط برای ثبت‌نام
      },
      async authorize(credentials) {
        const { phone, otp, name } = credentials as {
          phone: string;
          otp: string;
          name?: string;
        };
        if (!phone || !otp) return null;

        const otpRecord = await prisma.oTP.findFirst({
          where: { phone },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) throw new Error("OTP not found");
        if (otpRecord.expiresAt < new Date()) throw new Error("OTP Expired");

        const isValid = await bcrypt.compare(otp, otpRecord.codeHash);
        if (!isValid) throw new Error("Invalid OTP");

        let user = await prisma.user.findUnique({
          where: { phoneNumber: phone },
        });

        if (!user) {
          if (!name) throw new Error("NEW_USER_REQUIRE_NAME");
          user = await prisma.user.create({
            data: {
              phoneNumber: phone,
              name,
              isVerfied: true,
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // JWT فقط اطلاعات سبک
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          phoneNumber: user.phoneNumber,
          admin: user.admin,
          isVerfied: user.isVerfied,
        };
      }
      return token;
    },

    // Session.lazy-load
    async session({ session, token }) {
      if (token.user) {
        // پایه session
        session.user = { ...token.user };

        // Lazy-load جزئیات از DB فقط وقتی session لازم شد
        const dbUser = await prisma.user.findUnique({
          where: { id: token.user.id },
          include: {
            products: true,
            listordershop: true,
            address: true,
          },
        });

        if (dbUser) {
          session.user.products = dbUser.products;
          session.user.listordershop = dbUser.listordershop;
          session.user.address = dbUser.address;
          session.user.name = dbUser.name;
          session.user.createdAt = dbUser.createdAt;
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
