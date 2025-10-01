//actions\GetProductListDashboard.ts
"use server";
import { db as prisma } from '@/app/lib/db'
export type SortOption = 'new' | 'old' | 'cheap' | 'expensive';

export interface GetProductParams {

  page?: number;


}

export async function GetProductDashboard({

  page = 1,
}: GetProductParams) {
  const limit = 9;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};




  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,

        skip,
        take: limit,
        include: { productImage: true, categoryList: true, listProperty: true, review: true, colors: true },
      }),
      prisma.product.count({ where }),
    ]);



    return { products, totalCount };
  } catch (error) {
    console.error(error, 'خطا در دریافت لیست محصولات');
    throw new Error('خطا در سرور');
  }
}
