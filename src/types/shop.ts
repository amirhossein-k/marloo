// src/types/shop.ts

export type SortOption = 'new' | 'old' | 'cheap' | 'expensive';

// لیست مقادیر معتبر برای اعتبارسنجی
const VALID_SORT_OPTIONS: SortOption[] = ['new', 'old', 'cheap', 'expensive'];

// رابط برای ویژگی‌های ورودی به ShopPage
export interface ShopPageProps {
    params: { category: string };
    searchParams: {
        sort?: string;
        page?: string;
        minPrice?: string;
        maxPrice?: string;
        count?: string;
        offer?: string;
        [key: string]: string | string[] | undefined;
    };
}

/**
 * اعتبارسنجی می کند که آیا یک رشته ورودی یک SortOption معتبر است یا خیر.
 * @param value رشته‌ای که از searchParams گرفته شده است.
 * @returns SortOption معتبر یا undefined.
 */
export function isValidSortOption(value: string | undefined): SortOption | undefined {
    if (value && VALID_SORT_OPTIONS.includes(value as SortOption)) {
        return value as SortOption;
    }
    return undefined;
}