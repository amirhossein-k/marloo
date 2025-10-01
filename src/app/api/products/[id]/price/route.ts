// src\app\api\products\[id]\price\route.ts
import { db as prisma } from '@/app/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
) {


    try {
        // check admin
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.admin) {

            return NextResponse.json({ error: true, success: false, message: 'ادمین نیستی شیطون بلا' }, { status: 401 })
        }

        const { id } = context.params;
        const { price, priceOffer } = await req.json();

        if (typeof price !== 'number' || price < 0) {
            return NextResponse.json({ error: true, success: false, message: 'ادمین نیستی شیطون بلا' }, { status: 400 });
        }

        // update
        const updated = await prisma.product.update(
            {
                where: { id },
                data: {
                    price, priceOffer: priceOffer ?? 0
                }
            }
        )

        return NextResponse.json({ error: false, success: true, message: 'اپدیت شد', updated }, { status: 200 });



    } catch (error) {
        console.error("❌ Error updating product price:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }


}