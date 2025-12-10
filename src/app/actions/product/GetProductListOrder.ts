// src\app\actions\product\GetProductListOrder.ts
"use server";
import { db as prisma } from '@/app/lib/db'
import { redis } from '@/lib/redis';
import { FormattedEasaypostType, FormattedPostType } from '@/types';
import { format } from 'date-fns';

export type SortOption = 'new' | 'old' | 'cheap' | 'expensive';

// تابع کمکی برای تبدیل تاریخ به فرمت میلادی
function formatToGregorianDate(date: Date): string {
  return format(date, 'MM/dd/yyyy/HH');
}


export interface GetProductParams {
  category?: string;
  sort?: SortOption;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  count?: number;
  offer?: number;
}

export async function GetProduct({
  category,
  sort,
  page = 1,
  minPrice,
  maxPrice,
  count,
  offer
}: GetProductParams) {
  const limit = 9;
  const skip = (page - 1) * limit;

  // 1) ساخت کلید cache
  const cacheKey = [
    "products",
    category || "all",
    `sort=${sort || "new"}`,
    `page=${page}`,
    `min=${minPrice ?? 0}`,
    `max=${maxPrice ?? 1000000000}`,
    `count=${count ?? 1}`,
    `offer=${offer ?? 1}`,
  ].join(":");

  // 2) تلاش برای خواندن از cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return cached as { products: FormattedEasaypostType[]; totalCount: number };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (category) {
    where.categoryList = { some: { category } }
  }

  // شرط فیلتر قیمت
  if (minPrice !== undefined && maxPrice !== undefined) {
    where.price = {
      gte: minPrice,
      lte: maxPrice
    };
  }

  // اگر available تعریف شده باشد، فقط محصولاتی که:
  // - اگر available true باشد، count برابر 1 داشته باشند
  // - اگر available false باشد، count برابر 0 داشته باشند
  if (count !== undefined) {
    // where.count = count === 1 ? 1 : 0;
    if (count === 1) {
      where.count = 1;  // فقط موجودها
    } else if (count === 0) {
      where.count = 0;  // فقط ناموجودها
    } else if (count === 2) {
      // هیچ فیلتری اعمال نشود → همه نمایش داده شوند
    }
  }

  if (offer !== undefined) {
    if (offer === 0) {
      where.priceOffer = 0
    } else {
      where.priceOffer = { gte: offer }
    }
  }




  console.log(where, 'action avalible')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: Record<string, any> = {};
  switch (sort) {
    case 'new':
      orderBy = { createdAt: 'desc' };
      break;
    case 'old':
      orderBy = { createdAt: 'asc' };
      break;
    case 'cheap':
      orderBy = { price: 'asc' };
      break;
    case 'expensive':
      orderBy = { price: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,

        // فقط فیلدهای مورد نیاز برای FormattedEasaypostType
        select: {
          id: true,
          title: true,
          price: true,
          priceOffer: true,
          priceWithProfit: true,
          count: true,
          countproduct: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          discountEndDate: true,
          lastUpdatedBySupplier: true,
          productImage: true, // باید با نوع PHOTO در اسکیمای Prisma سازگار باشد
          colors: true,       // نوع Colors[]
          review: true,       // نوع Review[]
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedListProduct: FormattedEasaypostType[] = products.map((product) => ({
      ...product,
      createdAt: formatToGregorianDate(product.createdAt),
      updatedAt: formatToGregorianDate(product.updatedAt),
      discountEndDate: product.discountEndDate
        ? formatToGregorianDate(product.discountEndDate)
        : null, // باید با Type نهایی (string | null) منطبق باشد.
    }));
    const result = { products: formattedListProduct, totalCount };
    // 4) ذخیره در cache با TTL (مثلاً ۶۰ ثانیه)
    await redis.set(cacheKey, result, { ex: 60 * 5 }); // کش به مدت ۵ دقیقه

    return result;

  } catch (error) {
    console.error(error, 'خطا در دریافت لیست محصولات');
    throw new Error('خطا در سرور');
  }
}
