// app/actions/bmv/bmv.ts
"use server";
import { db as prisma } from "@/app/lib/db";
import { actionsGetRes } from "@/types";
import type { Brand, InvoiceProduct, Model, Variant } from "@prisma/client";

/** ---- Helper types (خواناتر و ایمن‌تر) ---- */
export type BrandWithModels = Brand & { models: Model[] };
export type ModelWithBrandAndVariants = Model & {
  brand: Brand | null;
  variants: Variant[];
};
export type VariantWithModelAndBrand = Variant & {
  model: (Model & { brand: Brand | null }) | null;
  invoices: InvoiceProduct[];
};

/** ---- Brands ---- */
export async function GetBrands(): Promise<
  actionsGetRes<BrandWithModels[]>
> {
  try {
    const brands: BrandWithModels[] = await prisma.brand.findMany({
      include: { models: true },
    });

    if (!brands.length) {
      return {
        data: [],
        error: true,
        message: "هیچ برندی یافت نشد",
        success: false,
      };
    }

    return {
      data: brands,
      error: false,
      message: "اطلاعات برندها دریافت شد",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return {
      data: [],
      error: true,
      message: "خطا در دریافت برندها",
      success: false,
    };
  }
}

/** ---- Models (by brand) ---- */
export async function GetModels(
  brandId: string
): Promise<actionsGetRes<ModelWithBrandAndVariants[]>> {
  try {
    if (!brandId || !/^[0-9a-fA-F]{24}$/.test(brandId)) {
      return {
        data: [],
        error: true,
        message: "شناسه برند نامعتبر است",
        success: false,
      };
    }

    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return {
        data: [],
        error: true,
        message: "برند یافت نشد",
        success: false,
      };
    }

    const models: ModelWithBrandAndVariants[] =
      await prisma.model.findMany({
        where: { brandId },
        include: { brand: true, variants: true },
      });

    return {
      data: models,
      error: false,
      message: "اطلاعات مدل‌ها دریافت شد",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching models:", error);
    return {
      data: [],
      error: true,
      message: "خطا در دریافت مدل‌ها",
      success: false,
    };
  }
}

/** ---- Models (all) ---- */
export async function GetModelsALL(): Promise<
  actionsGetRes<ModelWithBrandAndVariants[]>
> {
  try {
    const models: ModelWithBrandAndVariants[] =
      await prisma.model.findMany({
        include: { brand: true, variants: true },
      });

    return {
      data: models,
      error: false,
      message: "اطلاعات مدل‌ها دریافت شد",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching models:", error);
    return {
      data: [],
      error: true,
      message: "خطا در دریافت مدل‌ها",
      success: false,
    };
  }
}

/** ---- Variants (by model) ---- */
export async function GetVariants(
  modelId: string
): Promise<actionsGetRes<VariantWithModelAndBrand[]>> {
  try {
    if (!modelId || !/^[0-9a-fA-F]{24}$/.test(modelId)) {
      return {
        data: [],
        error: true,
        message: "شناسه مدل نامعتبر است",
        success: false,
      };
    }

    const model = await prisma.model.findUnique({
      where: { id: modelId },
      include: { brand: true, variants: true },
    });
    if (!model) {
      return {
        data: [],
        error: true,
        message: "مدل یافت نشد",
        success: false,
      };
    }

    const variants: VariantWithModelAndBrand[] =
      await prisma.variant.findMany({
        where: { modelId },
        include: {
          // برندِ مدل هم داخلش بیاد تا بتونی در UI نشان بدهی
          model: { include: { brand: true } },
          invoices: true, // چون در خروجی تایپ داریم، اینجا هم باید include کنیم
        },
      });

    return {
      data: variants,
      error: false,
      message: "اطلاعات واریانت‌ها دریافت شد",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching variants:", error);
    return {
      data: [],
      error: true,
      message: "خطا در دریافت واریانت‌ها",
      success: false,
    };
  }
}

/** ---- Variants (all) ---- */
export async function GetVariantsALL(): Promise<
  actionsGetRes<VariantWithModelAndBrand[]>
> {
  try {
    const variants: VariantWithModelAndBrand[] =
      await prisma.variant.findMany({
        include: {
          model: { include: { brand: true } }, // مدل + برند
          invoices: true,
        },
      });

    return {
      data: variants,
      error: false,
      message: "اطلاعات واریانت‌ها دریافت شد",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching variants:", error);
    return {
      data: [],
      error: true,
      message: "خطا در دریافت واریانت‌ها",
      success: false,
    };
  }
}


export async function getBrandsModelsVariants() {
  const brands = await prisma.brand.findMany({
    include: {
      models: {
        include: {
          variants: true,
        },
      },
    },
  });

  return brands.map(brand => ({
    id: brand.id,
    name: brand.name,
    models: brand.models.map(model => ({
      id: model.id,
      name: model.name,
      variants: model.variants.map(v => ({
        id: v.id,
        color: v.color,
        inventory: v.inventory,
      })),
    })),
  }));
}