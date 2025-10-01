// app/actions/product/GetProductList.ts
'use server'

import { db as prisma } from '@/app/lib/db'
import { FormattedPostType, Product, ProductWithRelations } from '@/types'
import { format, subMonths } from 'date-fns';

// تابع کمکی برای تبدیل تاریخ به فرمت میلادی
function formatToGregorianDate(date: Date): string {
    return format(date, 'MM/dd/yyyy/HH');
}

export async function GetProductList(): Promise<Product[]> {
    try {
        const listProduct: Product[] = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                colors: true,
                productImage: true,
                categoryList: true,
                listProperty: true,
                review: true,


            },
        })
        return listProduct
    } catch (error) {
        console.error("❌ error get listProduct:", error)
        return []
    }
}

export async function GetNewProducts(): Promise<Product[]> {
    try {
        const oneMonthAgo = subMonths(new Date(), 1) // یک ماه قبل

        const newProducts: Product[] = await prisma.product.findMany({
            where: {
                createdAt: {
                    gte: oneMonthAgo, // فقط محصولاتی که در یک ماه اخیر ساخته شدن
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                colors: true,
                productImage: true,
                categoryList: true,
                listProperty: true,
                review: true,
            },
        })

        return newProducts
    } catch (error) {
        console.error("❌ error get new products:", error)
        return []
    }
}

export async function GetProduct() {
    try {
        const listProduct: ProductWithRelations[] = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                colors: true,
                productImage: true,
                categoryList: true,
                review: true,
                listProperty: true,
                productVariants: {
                    include: {
                        variant: {
                            include: {
                                model: {
                                    include: {
                                        brand: true,
                                        variants: true   // 👈 اضافه کن
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });

        const formattedListProduct: FormattedPostType[] = listProduct.map((product) => ({
            ...product,
            createdAt: formatToGregorianDate(product.createdAt),
            updatedAt: formatToGregorianDate(product.updatedAt),
        }));

        return formattedListProduct;
    } catch (error) {
        console.log(error, "error get listproduct error");
        return [];
    }
}