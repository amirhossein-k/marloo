// src\app\api\products\add\route.ts
import { getToken } from "next-auth/jwt";
import { db as prisma } from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server';
import { Colors } from "@prisma/client";

interface ImageObject {
  key: string;
  url: string;
  id: string;
}

// interface Colors {
//   color: string, inventory: number, model: string
// }
interface ProductRequest {
  name: string;
  price: number;
  html: string;
  checkbox: string;
  tableContent: string
  detailImage: ImageObject[]; // آرایه‌ای از اشیای تصویر
  imageDefult: string;
  selectedImageId: string;
  count: number;
  countproduct: number;
  priceOffer: number;
  category: string[]
  tags: string[]
  selectedVariantId: string[]
  supplierId: string
  colors: Colors[]
  discountDaysLeft: number;
  discountEndDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    const requestData: ProductRequest = await request.json();
    const { name, price, html, checkbox, tableContent, detailImage, imageDefult, selectedImageId, count, countproduct, priceOffer, category, tags, selectedVariantId, supplierId, colors, discountDaysLeft, discountEndDate } = requestData;
    // eslint-disable-next-line prefer-const
    let checkedit = checkbox === "انتشار";
    console.log('haaaaaaaaaaa')
    console.log(`${name}  || ${price} || ${html} || ${checkbox} ===${checkedit} || ${detailImage} ||${imageDefult} 
  || ${selectedImageId} || ${count} || ${countproduct} || ${priceOffer} || ${category} || ${tags} || ${tableContent} || ${selectedVariantId} || ${supplierId}`)
    console.log("🛠️ [API] Full requestData:", requestData);
    console.log("🛠️ [API] tableContent:", JSON.stringify(requestData.tableContent));
    // اعتبارسنجی فیلدهای اجباری
    if (!name || !price || !html) {
      return NextResponse.json(
        { error: 'عنوان، قیمت و نویسنده الزامی هستند' },
        { status: 400 }
      );
    }
    // ---- اینجا بخش حذف قبل از <table> ----
    let cleanTableContent = "";
    const idx = tableContent.indexOf("<table");
    if (idx !== -1) {
      cleanTableContent = tableContent.slice(idx);
    }
    console.log("» جدول تمیز:", cleanTableContent);



    console.log(token, 'token data');
    console.log(token?.id, "token id");
    if (!token?.user) {
      return NextResponse.json(
        { error: 'کاربر احراز هویت نشده است' },
        { status: 401 }
      );
    }
    console.log('before')
    console.log(">>> Received tableContent on server:", tableContent);


    const newProduct = await prisma.product.create({
      data: {
        title: name,
        content: html,
        tableContent: cleanTableContent,// اگر tableContent null یا undefined باشد، خالی ذخیره شود
        published: checkedit,
        price: Number(price),
        authorId: token.user?.id || token.sub,
        count: Number(count),
        countproduct: Number(countproduct) || 0, // 👈 نگاشت به مدل دیتابیس
        priceOffer: Number(priceOffer) || 0,
        tags,
        // selectedVariantId: selectedVariantId || null, // ← اینجا اضافه شد
        supplierId: "68a88379c8f4ab7244b76bd1", // 🔥 مهم
        discountDaysLeft, discountEndDate



      },
      include: { author: true },
    });
    console.log(newProduct, 'post save');

    // ✅ ذخیره کردن رنگ‌ها
    if (colors && colors.length > 0) {
      for (const col of colors) {
        await prisma.colors.create({
          data: {
            color: col.color,
            inventory: col.inventory,
            model: col.model,
            parentModel: col.parentModel || null,
            productId: newProduct.id,
          },
        });
      }
    }

    if (selectedVariantId && selectedVariantId.length > 0) {
      for (const variantId of selectedVariantId) {
        await prisma.productVariant.create({
          data: {
            productId: newProduct.id,
            variantId: variantId,
          },
        });
      }
    }


    const filternotEmty = detailImage.filter(filt => filt.key !== '');
    for (let i = 0; i < filternotEmty.length; i++) {
      if (filternotEmty[i].id === selectedImageId) {
        await prisma.productImage.create({
          data: {
            defaultImage: true,
            childImage: filternotEmty[i].url,
            fileKey: filternotEmty[i].key,
            ownerId: newProduct.id,
          },
        });
      } else {
        await prisma.productImage.create({
          data: {
            defaultImage: false,
            childImage: filternotEmty[i].url,
            fileKey: filternotEmty[i].key,
            ownerId: newProduct.id,
          },
        });
      }
    }

    // category
    for (let i = 0; i < category.length; i++) {
      await prisma.categoryList.create({
        data: {
          category: category[i],
          ownerId: newProduct.id
        }
      })
    }


    return NextResponse.json(
      { success: true, message: "پست جدید ذخیره شد" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error, 'error login error');
    return NextResponse.json(
      { error: 'خطا در سرور' },
      { status: 500 }
    );
  }
}
