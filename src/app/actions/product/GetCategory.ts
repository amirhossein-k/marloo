'use server'

import { db as prisma } from '@/app/lib/db'
import { CategotyProduct } from '@prisma/client'

export async function getCategory(): Promise<CategotyProduct[]> {
    try {

        const categories = await prisma.categotyProduct.findMany({})

        return categories as CategotyProduct[]
    } catch (error) {
        console.error("❌ error get new products:", error)
        return []
    }
}