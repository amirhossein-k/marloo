
// src\app\api\products\checkout\preview\route.ts
import { CartItem } from "@/store/orderSlice";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function POST(req: NextRequest) {


    const { items, total: totalReq }: { items: CartItem[], total: number } = await req.json()
    // items[] ===> clientSideId =ایدی سبد, product=اطلاعات محصول انتخابی ,
    // quantity= تعداد محصول انتخابی ,colorsSelect=رنگ محصول انتخابی ,
    // unitPrice =قیمت پایه محصول,totalPrice=قیمت کل این محصول,
    console.log(items, 'items')

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ message: 'سبد خرید خالی است' }, { status: 400 })
    }



    try {

        let totalFinal = 0
        for (const cartItem of items) {
            // هر محصول که کاربر انتخاب کرده ایجاد درسترسی میگیرم ان محصول خاص را
            // محصولی مه انتخاب کرده ایتم هاشو جمع میزنیم
            const product = await prisma.product.findUnique({
                where: {
                    id: cartItem.product.id,


                },
                select: {
                    id: true, title: true, priceWithProfit: true, colors: true, countproduct: true, priceOffer: true
                }
            })
            // console.log(product, 'postt')

            if (!product) {
                return NextResponse.json({
                    message: `محصولات یافت نشدند  ${cartItem.product.title}`, error: true,
                    success: false
                }, { status: 404 })
            }
            console.log(product, 'product')


            if (product?.priceOffer === undefined) return NextResponse.json({
                message: `محصولات یافت نشدند ${cartItem.product.title}`, error: true,
                success: false
            }, { status: 404 })
            console.log(product?.priceOffer, 'product?.priceOffer')


            const basePrice = product.priceWithProfit as number;
            // ✅ قیمت بعد از تخفیف
            const finalUnitPrice =
                product.priceOffer && product.priceOffer > 0
                    ? Math.round(basePrice * (1 - product.priceOffer / 100))
                    : basePrice;

            const totalPriceCheck = finalUnitPrice * cartItem.quantity === cartItem.totalPrice

            totalFinal += finalUnitPrice * cartItem.quantity

            if (!totalPriceCheck) {
                return NextResponse.json({
                    message: `لطفا سبد خرید خود را بروز کنید`, error: true,
                    success: false
                }, { status: 404 })
            }
            console.log(totalPriceCheck, 'totalPriceCheck')

            const avalible = product.countproduct >= cartItem.quantity  //if true availible product for buy

            console.log(avalible, 'avalible')
            if (!avalible) return NextResponse.json({
                message: `
                محصول
                ${cartItem.product.title}
                را بیشتر از مقدار موجودی فروشگاه انتخاب کردی(${product.countproduct})
                `, error: true,
                success: false
            }, { status: 400 })
        }

        if (totalReq !== totalFinal) return NextResponse.json({
            message: `لطفا سبد خرید خود را بروز کنید`, error: true,
            success: false
        }, { status: 404 })
        console.log(totalReq, 'totalReq !== totalFinal')

        // فرضی: هزینه بسته‌بندی، تخفیف و مالیات
        //  بسته بندی
        const packaging = 0;
        // پست

        // محاسبه قیمت شود با توجه به ایتم وردوی که ادرس میگیری بدست اید یا میشود جدا گانه این ایتم ست شود
        const posting = 50000;



        // مالیات
        const tax = Math.round(totalReq * 0.09); // ۹٪ مالیات
        // تخفیف
        const discount = totalReq > 1000000 ? 50000 : 0;
        //  جمع  کل با پست مالیات و....
        const total = totalReq + packaging + tax + posting - discount;

        return NextResponse.json(
            {
                data: {

                    totalReq, //مجموع محصولات
                    packaging, // بسته بندی
                    tax, // مالیات
                    discount, // تخفیف
                    total, // جمع  کل با پست مالیات و....
                    posting, // پست
                },
                message: "فاکتور اماده شده است",
                error: false,
                success: true

            }, { status: 200 }
        )



    } catch (error) {
        console.log(error, 'error invoice')
        return NextResponse.json({
            message: "خطا درون شبکه فاکتور سازی", error: true,
            success: false
        }, { status: 500 })
    }
}