

import { db as prisma } from '@/app/lib/db'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GetProduct } from '@/app/actions/product/GetProductList';

export async function DELETE(req: Request,
    { params }: { params: { id: string } }
) {
    try {

        const session = await getServerSession(authOptions)
        if (!session || session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!session.user.admin) {
            return NextResponse.json({ error: "ادمین نیستی" }, { status: 403 })
        }

        const { id } = params
        //  check product id
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) {
            return NextResponse.json({ error: "محصولی نیست که بخوای حذف کنی" }, { status: 404 })
        }
        await prisma.product.delete({ where: { id } })

        return NextResponse.json({ success: true, message: 'حذف شد ' })

    } catch (error) {
        console.error("❌ Error deleting product:", error);
        return NextResponse.json(
            { error: "خطا در حذف محصول" },
            { status: 500 }
        );
    }
}


export async function GET(req: Request, { params }: { params: { id: string } }) {
    const products = await GetProduct();
    const product = products.find(p => p.id === params.id);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
}