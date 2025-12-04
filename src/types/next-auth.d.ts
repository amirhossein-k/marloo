// src\types\next-auth.d.ts
import type { Product, InvoiceProduct, Address } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            phoneNumber?: string;
            admin?: boolean;
            isVerfied?: boolean;
            products: Product[];
            listordershop: InvoiceProduct[];
            address: Address[]; // 👈 درست شد (address نه adress)
            createdAt?: Date;   // 👈 گذاشتم اختیاری
            name?: string | null;
            email?: string | null;
            image?: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        phoneNumber?: string;
        admin?: boolean;
        isVerfied?: boolean;
        products?: Product[];
        listordershop?: InvoiceProduct[];
        address?: Address[];  // 👈 درست شد
        createdAt?: Date;     // 👈 اختیاری
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: User;
    }
}
