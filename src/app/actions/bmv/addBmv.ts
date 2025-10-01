"use server";
import { db as prisma } from "@/app/lib/db";
import { actionsGetRes } from "@/types";
import type { Brand, InvoiceProduct, Model, Variant } from "@prisma/client";

export async function addBrand(
    formData: FormData
): Promise<actionsGetRes<Brand>> {
    const name = formData.get("name") as string;

    try {
        const brand = await prisma.brand.create({
            data: {
                name,
            },
            include: { models: true },
        });

        return {
            error: false,
            message: "برند با موفقیت اضافه شد",
            success: true,
            data: brand,
        };
    } catch (error) {
        console.error("Error adding brand:", error);
        return {
            success: false,
            error: true,
            message: "خطا در افزودن برند",
            data: { id: "", name: "" },
        };
    }
}

export async function addModel(
    formData: FormData
): Promise<actionsGetRes<Model>> {
    const name = formData.get("name") as string;
    const brandId = formData.get("brandId") as string;

    try {
        const brand = await prisma.model.create({
            data: {
                name,
                brandId,
            },
            include: { brand: true, variants: true },
        });

        return {
            error: false,
            message: "مدل با موفقیت اضافه شد",
            success: true,
            data: brand,
        };
    } catch (error) {
        console.error("Error adding brand:", error);
        return {
            success: false,
            error: true,
            message: "خطا در افزودن برند",
            data: { id: "", name: "", brandId: "" },
        };
    }
}

export async function addVariant(
    formData: FormData
): Promise<
    actionsGetRes<
        (Variant & { model: Model | null; invoices: InvoiceProduct[] })[]
    >
> {
    const modelId = formData.get("modelId") as string;
    const inventory = parseInt(formData.get("inventory") as string);
    const colors = JSON.parse(formData.get("colors") as string) as string[];

    try {
        const variants = await Promise.all(
            colors.map((color) =>
                prisma.variant.create({
                    data: {
                        color,
                        inventory,
                        modelId,
                    },
                    include: { model: true, invoices: true },
                })
            )
        );
        return {
            success: true,
            data: variants,
            message: "رنگ‌ها و موجودی با موفقیت اضافه شدند",
            error: false,
        };
    } catch (error) {
        console.error("Error adding variant:", error);
        return {
            success: false,
            error: true,
            message: "خطا در افزودن رنگ و موجودی",
            data: [],
        };
    }
}

type ItemType = "brand" | 'model' | 'variant'

export async function deleteItem(type: ItemType, id: string) {
    try {
        switch (type) {
            case 'brand':
                await prisma.brand.delete({ where: { id } })
                break
            case 'model':
                await prisma.model.delete({ where: { id } })
                break
            case 'variant':
                await prisma.variant.delete({ where: { id } })
                break
            default:
                throw new Error('نوع آیتم معتبر نیست')
        }

        return { success: true, message: 'آیتم با موفقیت حذف شد' }
    } catch (error) {
        console.error(`Error deleting ${type}:`, error)
        return { success: false, message: 'خطا در حذف آیتم' }
    }
}