"use server";
import { redirect } from "next/navigation";

export async function selectVariant(formData: FormData) {
    const variantId = formData.get("variantId") as string;

    console.log("Variant selected:", variantId);

    // مثلا بعد از انتخاب، کاربر به همان صفحه برگردد
    redirect(`/products/${variantId}`);
    // یا فقط void بازگردانید
}
