'use server'

import { revalidatePath } from "next/cache";

// Server Action برای باطل کردن کش صفحه محصول

export async function revalidateProductPage(productId:string) {
    try {
        revalidatePath(`/product/${productId}`)
    } catch (error) {
console.error('Error revalidating product page:', error);
    return { success: false, error: 'خطا در به‌روزرسانی صفحه محصول' };
    }
}