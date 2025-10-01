

import { db as prisma } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    if (!q) return NextResponse.json([])

    const product = await prisma.product.findMany({
        where: {
            title: {
                contains: q,
                mode: 'insensitive'
            }
        },
        select: {
            id: true,
            title: true,
            price: true
        },
        take: 5 //5 نتیجه اول
    })

    return NextResponse.json(product)

}

