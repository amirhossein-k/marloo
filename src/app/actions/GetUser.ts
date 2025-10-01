//actions\GetUser.ts
"use server";
import { db as prisma } from '@/app/lib/db';
import { ADRESS } from '@/types';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server'

import type { Prisma } from "@prisma/client";

export type USERTYPE = Prisma.UserGetPayload<{
    include: {
        products: {
            include: {
                productImage: true;
                categoryList: true;
                review: true;
                listProperty: true;
            };
        };
        address: true;
        listordershop: {
            include: {
                order: true;
                variant: true;
            };
        };
    };
}>;

export async function fetchUser(id: string): Promise<USERTYPE | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                products: { include: { productImage: true, categoryList: true, review: true, listProperty: true } },
                address: true,
                listordershop: { include: { order: true, variant: true } }
            }
        });
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Optional wrapper for API response
export async function GetUser(id: string): Promise<NextResponse> {
    const user = await fetchUser(id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
}

// export async function GetUser(id: string): Promise<NextResponse<USERTYPE | { error: string }>> {
//     try {
//         const user: USERTYPE | null = await prisma.user.findUnique({
//             where: { id },
//             include: {
//                 products: {
//                     include: { productImage: true, categoryList: true, review: true, listProperty: true }
//                 },
//                 address: true,
//                 listordershop: { include: { order: true, variant: true } }
//             }
//         });

//         if (!user) {
//             return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }

//         return NextResponse.json({
//             ...user,
//             products: user.products || [],
//             address: user.address || [],
//             listordershop: user.listordershop || []
//         });

//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: 'خطا در سرور' }, { status: 500 });
//     }
// }


export async function updateUserAddress({ address }: { address: ADRESS[] }) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };
    if (!address || !Array.isArray(address)) {
        return { error: "آدرس نامعتبر است" };
    }
    // بررسی تمام فیلدهای ضروری
    for (const addr of address) {
        if (!addr.location || !addr.state || !addr.zipcode) {
            return { error: "تمام فیلدهای آدرس باید پر شوند" };
        }
    }
    console.log(session, 'seesion addres')

    try {
        console.log(address, 'address action')
        // ابتدا آدرس‌های فعلی کاربر را خالی می‌کنیم
        // await prisma.user.update({
        //   where: { id: session.id },
        //   data: { address: { set: [] } },
        // });
        await prisma.adress.deleteMany({
            where: { userId: session.user.id },
        });


        // سپس آدرس‌های جدید را ایجاد کرده و به کاربر متصل می‌کنیم

        const createad = await prisma.adress.create({
            data: {
                location: address[0].location,
                state: address[0].state,
                zipcode: address[0].zipcode,
                id: address[0].id,
                userId: session.user.id,

            }
        })
        console.log(createad, 'created action')

        return {
            success: true,
            data: {
                id: session.user.id,
                address: createad

            }
        };
    } catch (error) {
        return {
            error: "خطا در بروزرسانی آدرس",
            details: error instanceof Error ? error.message : "Unknown error"
        };
    }

}

export async function GetUserAD(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                products: {
                    include: { productImage: true }
                },
                address: true, listordershop: true
            }
        });

        if (!user) {
            return { error: 'User not found' };
        }

        // تبدیل تمام Dateها به string
        const serializedUser = {
            ...user,
            createdAt: user.createdAt.toISOString(),
            products: user.products.map(post => ({
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                productImage: post.productImage.map(image => ({
                    ...image
                }))
            })),
            address: user.address || [],
            listordershop: user.listordershop || []
        };

        console.log(serializedUser, 'action get user');
        return serializedUser;

    } catch (error) {
        console.error(error, 'error in GetUser');
        return { error: 'خطا در سرور' };
    }
}
