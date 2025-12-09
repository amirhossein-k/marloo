
import type { Colors, User } from "@prisma/client";

// export interface USERTYPE {
//   id: string
//   phoneNumber: string
//   password: string | null
//   name: string | null
//   products: Product[]
//   createdAt: Date
//   isVerfied: boolean;
//   listordershop: InvoiceProduct[];
//   address: ADRESS[];
//   admin: boolean

// }
export type USERTYPE = User & {
  products: Product[];
  listordershop: InvoiceProduct[];
  address: ADRESS[];
};

export type InvoiceProduct = {
  id: string;
  order: Product[]
  idOrder: string
  status: OrderStatus
  countOrder: number;
  total: number;
  odditemTotal?: number;
};
export type OrderStatus = 'LOADING' | "SEE" | "POST" | "DONE";


export interface PHOTO {
  id: string
  defaultImage: boolean
  childImage: string
  fileKey: string | null
  ownerId: string | null


}

// رابط جدید برای خروجی با تاریخ‌های فرمت‌شده
// export interface FormattedPostType extends Omit<Product, 'createdAt' | 'updatedAt'> {
//   createdAt: string;
//   updatedAt: string;
// }
// export interface FormattedPostType
//   extends Omit<ProductWithRelations, "createdAt" | "updatedAt" | "productVariants"> {
//   createdAt: string;
//   updatedAt: string;
// }



export interface Product {
  quantity?: string
  id: string
  content?: string | null
  title: string
  published: boolean
  price: number
  priceWithProfit?: number | null
  count: number
  colors: Colors[]
  countproduct: number
  priceOffer?: number | null
  author?: USERTYPE
  authorId: string
  createdAt: Date
  updatedAt: Date
  productImage: PHOTO[]
  categoryList: Category[]
  review: Review[]
  tags: string[]
  productVariants?: ProductVariant[]   // 👈 رابطه جدید
  tableContent: string | null
  discountDaysLeft?: number | null;
  discountEndDate?: Date | null;
  // فیلدهای مربوط به supplier
  // lastUpdatedBySupplier?: Date;
  // supplierId?: string;
  // supplier?: Supplier;

}
export interface Supplier {
  id: string;
  name: string;
  phoneNumber: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProductVariant {
  id: string
  productId: string
  variantId: string
  variant?: Variant | null   // 👈 اضافه شد
}
export interface Variant {
  id: string
  color: string
  inventory: number
  modelId: string | null   // 👈 اصلاح شد
  model?: Model | null
  productVariants?: ProductVariant[]
}



export interface Model {
  id: string
  name: string
  brandId: string | null
  brand?: Brand | null
  variants?: Variant[]   // 👈 اینجا اختیاری شد
}

export interface Brand {
  id: string
  name: string
  models: Model[]
}
export interface Review {
  reviewText: string
  name: string
  email: string
  createdAt: Date
  rating: number
}

export interface Category {
  id: string
  category: string
}

export interface ADRESS {
  location: string;
  state: string;
  zipcode: string;
  id: string
  userId: string
}


export interface CATEGORYLayout {
  id: string
  item?: CATEGORYLayoutITEM[]
  layout: string
  item2?: CATEGORYLayoutITEM[]

}

export interface CATEGORYLayoutITEM {
  id: string
  link: string
  pic: string
  title: string
  subtitle?: string
  count?: string

}
export interface actionsGetRes<T> {
  data: T
  error: boolean
  success: boolean
  message: string
  isLoading?: boolean;// اضافه کردن isLoading

}
export interface actionsGetResWithoutData {

  error: boolean
  success: boolean
  message: string
  isLoading?: boolean;// اضافه کردن isLoading

}

import type { Prisma } from "@prisma/client";

export type USERTYPEPrisma = Prisma.UserGetPayload<{
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
// خروجی دقیق Product با تمام include ها
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    // author: true; // اضافه شده برای دقت بیشتر در روابط
    // supplier: true; // اضافه شده برای دقت بیشتر در روابط
    colors: true,
    productImage: true;
    categoryList: true;
    review: true;
    listProperty: true;
    productVariants: {
      include: {
        variant: {
          include: {
            model: {
              include: {
                brand: true;
                variants: true;
              };
            };
          };
        };
      };
    };
    // discountDaysLeft: true;
    // discountEndDate: true;
  };
}>;

export type SortOption =
  | 'new'
  | 'popular'
  | 'cheap'
  | 'expensive';

// تعریف Type برای خروجی با تاریخ‌های فرمت‌شده
export type FormattedPostType = Omit<
  ProductWithRelations,
  | "createdAt"
  | "updatedAt"
  | "discountEndDate" |

  ""
> & {
  // فیلدهای تاریخ (فرمت شده به string)
  createdAt: string;
  updatedAt: string;
  discountEndDate: string | null;

  // فیلدهای دیگری که ممکن است در Omit حذف شده باشند (مانند lastUpdatedBySupplier)
  lastUpdatedBySupplier: Date | null;
};
export type FormattedEasaypostType = {
  createdAt: string;
  updatedAt: string;
  discountEndDate: string | null;
  content: string | null;

  lastUpdatedBySupplier: Date | null;
  id: string
  price: number
  title: string
  count: number
  productImage: PHOTO[]
  priceOffer?: number | null
  priceWithProfit?: number | null
  countproduct: number
  colors: Colors[]
  review: Review[]
}
export type ReviewList = Prisma.ReviewListGetPayload<{ select: object }>;
export type CategoryList = Prisma.CategoryListGetPayload<{ select: object }>;
export type ListProperty = Prisma.ListPropertyGetPayload<{ select: object }>;
// --- تعریف Typeهای کمکی سفارشی برای FormattedPostType ---

// تعریف Type برای تصاویر (PHOTO)
export interface PHOTO {
  id: string;
  defaultImage: boolean;
  childImage: string;
  fileKey: string | null;
  ownerId: string | null;
}

// تعریف Type برای واریانت‌های محصول با مدل و برند
export type ProductVariantWithRelations = Prisma.ProductVariantGetPayload<{
  include: {
    variant: {
      include: {
        model: {
          include: {
            brand: true;
            variants: true;
          };
        };
      };
    };
  };
}>;
// export Colors
// export interface Variant{
//   id:string
//   color: string
//   inventory:number
//   modelId:string
// }

// export interface Model {
//   id: string
//   name:string
// brandId:string
// variants:Variant[]
// }

// export interface Brand{
//   id :string
//   name: string
//   models:Model[]
// }



// export type FullPurchaseOrderRedux = Prisma.PurchaseOrderGetPayload<{
// select{

//   omit: {
//     createdAt: true,
//     updatedAt: true,

//   }, include: {
//     product: {
//       omit: {
//         lastUpdatedBySupplier: true, updatedAt: true, createdAt: true
//       }
//     }
//     }
//   }


// }>;

export type Slide = {
  id: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  img: string;
  styleParent?: string
  imageItem?: string[]
  align?: "left" | "right"; // محل قرارگیری متن روی تصویر
  content: React.ReactNode; // 👈 محتوای اختصاصی برای هر اسلاید
};