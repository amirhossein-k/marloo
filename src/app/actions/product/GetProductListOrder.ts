// actions/GetProductListOrder.ts
"use server";
import { db as prisma } from '@/app/lib/db'
import { FormattedPostType } from '@/types';
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
        include: {  // 👈 روابط حذف شده را اضافه کنید
          author: true,
          supplier: true,
          productVariants: {
            include: {
              variant: {
                include: {
                  model: {
                    include: {
                      brand: true,
                      variants: true
                    }
                  }
                }
              }
            }
          }, productImage: true, categoryList: true, review: true, listProperty: true, colors: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const formattedListProduct: FormattedPostType[] = products.map((product) => ({
      ...product,
      createdAt: formatToGregorianDate(product.createdAt),
      updatedAt: formatToGregorianDate(product.updatedAt),
      discountEndDate: product.discountEndDate
        ? formatToGregorianDate(product.discountEndDate)
        : null, // باید با Type نهایی (string | null) منطبق باشد.
    }));
    return { products: formattedListProduct, totalCount };
  } catch (error) {
    console.error(error, 'خطا در دریافت لیست محصولات');
    throw new Error('خطا در سرور');
  }
}
