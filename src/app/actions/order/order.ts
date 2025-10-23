
// src\app\actions\order\order.ts
"use server";

import { db as prisma } from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth"; // اگر auth داری
import { Prisma } from "@prisma/client"; // ایمپورت Prisma برای دسترسی به enum
import { CartItem } from "@/store/orderSlice";
import { authOptions } from "@/lib/auth";
// import type { CartItem } from "@/store/cartSlice"; // تایپ را از اسلایس ایمپورت می‌کنیم

// اینترفیس ورودی برای افزودن محصول به سبد خرید
interface CreateOrderInput {
    productId: string;
    colorsSelect: string;
    quantity: number;
    // supplierId: string
    // totalPrice: string

}

/**
 * تابع برای گرفتن سبد خرید فعلی کاربر (سفارش‌هایی با وضعیت LOADING)
 */
// این تابع برای همگام‌سازی اولیه باقی می‌ماند

export async function FetchOrders() {
    try {

        const session = await getServerSession(authOptions);
        console.log(session, 'sesssion')
        if (!session?.user?.id || !session) {
            // return { success: false, error: true, message: "لطفا برای خرید وارد حساب کاربری شود" };
            throw new Error("لطفا برای خرید وارد حساب کاربری شود")

        }
        // یک کاربر فقط یک سبد خرید فعال دارد
        const cart = await prisma.purchaseOrder.findFirst({
            where: {
                storeOwnerId: session.user.id,
                status: "LOADING",
            },
            include: {
                // آیتم‌های داخل سبد خرید را به همراه اطلاعات کامل محصول هر آیتم می‌گیریم
                items: {
                    include: {
                        product: {
                            include: {
                                productImage: true,// برای نمایش عکس محصول در سبد خرید
                                colors: true
                            },
                            omit: { lastUpdatedBySupplier: true, updatedAt: true, createdAt: true }
                        },
                    },


                },
            },
            omit: {
                createdAt: true, updatedAt: true

            }
        });



        console.log(cart, 'carttttt')
        // تبدیل createdAt به رشته

        return { success: true, error: false, data: cart, message: "لیست خرید شما اماده شد." };

    } catch (error) {
        console.error("Error fetching cart:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("خطا در دریافت اطلاعات سبد خرید.");
    }
}

/**
 * تابع نهایی کردن سفارش
 * این تابع کل state سبد خرید را از کلاینت دریافت کرده و در دیتابیس ذخیره می‌کند
 */
export async function finalizeOrder({ items, totalPrice }: { items: CartItem[], totalPrice: number }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("کاربر شناسایی نشد.");

        // اعتبارسنجی قیمت‌ها در سمت سرور برای جلوگیری از تقلب
        const productIds = items.map(item => item.product.id);
        const productsFromDB = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, priceWithProfit: true },
        });

        const validatedTotalPrice = items.reduce((sum, clientItem) => {
            const dbProduct = productsFromDB.find(p => p.id === clientItem.product.id);
            if (!dbProduct) throw new Error(`محصول ${clientItem.product.title} یافت نشد.`);

            const realPrice = dbProduct.priceWithProfit!;
            return sum + (realPrice * clientItem.quantity);
        }, 0);

        if (Math.abs(validatedTotalPrice - totalPrice) > 0.01) {
            throw new Error("مغایرت در قیمت کل. لطفا سبد خرید خود را بررسی کنید.");
        }

        // ایجاد سفارش نهایی در دیتابیس
        // ۱. سبد خرید قبلی کاربر با وضعیت LOADING را پیدا می‌کنیم
        const existingCart = await prisma.purchaseOrder.findFirst({
            where: {
                storeOwnerId: session.user.id,
                status: "LOADING"
            }
        });
        const newItemsData = items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            colorsSelect: item.colorsSelect,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
        }));
        let order;
        if (existingCart) {
            // ۲. اگر سبد خریدی وجود داشت، آن را آپدیت می‌کنیم
            // ابتدا آیتم‌های قدیمی را حذف می‌کنیم
            await prisma.purchaseOrderItem.deleteMany({
                where: { orderId: existingCart.id }
            });
            // سپس سفارش را با آیتم‌های جدید و وضعیت جدید آپدیت می‌کنیم
            order = await prisma.purchaseOrder.update({
                where: { id: existingCart.id },
                data: {
                    totalPrice: totalPrice, //validatedTotalPrice
                    status: "LOADINGPAID", // وضعیت به "در انتظار تایید" تغییر می‌کند
                    items: {
                        create: newItemsData,
                    },
                },
            });
        } else {
            // ۳. اگر سبد خریدی وجود نداشت، یک سفارش جدید ایجاد می‌کنیم
            order = await prisma.purchaseOrder.create({
                data: {
                    storeOwnerId: session.user.id,
                    totalPrice: totalPrice, //validatedTotalPrice
                    status: "LOADINGPAID",
                    items: {
                        create: newItemsData,
                    },
                },
            });
        }
        // const order = await prisma.purchaseOrder.create({
        //     data: {
        //         storeOwnerId: session.user.id,
        //         totalPrice: validatedTotalPrice,
        //         status: "LOADINGPAID", //وضعیت یعنی کاربر منتقل شده برای پرداخت 
        //         items: {
        //             create: items.map(item => ({
        //                 productId: item.product.id,
        //                 quantity: item.quantity,
        //                 colorsSelect: item.colorsSelect,
        //                 unitPrice: item.unitPrice,
        //                 totalPrice: item.totalPrice,
        //             })),
        //         },
        //     },
        // });

        return { success: true, data: order, message: "سفارش شما با موفقیت ثبت شد." };
    } catch (error) {
        console.error("Error finalizing order:", error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "خطا در ثبت نهایی سفارش." };
    }
}


/**
 * تابع برای افزودن یک محصول به سبد خرید یا به‌روزرسانی تعداد آن
 */
export async function createOrder(data: CreateOrderInput) {
    try {
        console.log('createOrder!!!!!!!!!!!!')
        // 👇 چک هویت کاربر
        const session = await getServerSession(authOptions);
        console.log(session, 'sesssion')
        if (!session?.user?.id || session === null) {
            console.log('object')
            return { success: false, error: true, message: "لطفا برای خرید وارد حساب کاربری شود!" };
        }

        const userId = session.user.id;

        // ۱. اطلاعات محصول را برای قیمت‌گذاری پیدا می‌کنیم

        const product = await prisma.product.findUnique({
            where: { id: data.productId },
            select: { supplierId: true, priceWithProfit: true, priceOffer: true, colors: true, price: true },
        });

        if (!product) {
            throw new Error("محصول مورد نظر یافت نشد.");
        }
        // ✅ محاسبه قیمت واحد با تخفیف
        const basePrice = product.priceWithProfit
        if (basePrice == null) throw new Error("قیمت محصول مشخص نشده است.");

        const unitPrice =
            product.priceOffer && product.priceOffer > 0
                ? basePrice - (basePrice * product.priceOffer) / 100
                : basePrice;

        // فیلتر رنگ انتخاب‌شده از بین رنگ‌های همین محصول
        const selectedColor = product.colors.find(c => c.id === data.colorsSelect);
        if (!selectedColor) {
            return { success: false, error: true, message: "رنگ انتخاب‌شده برای این محصول وجود ندارد" };
        }
        if (selectedColor.inventory < data.quantity) {
            return {
                success: false,
                error: true,
                message: `حداکثر ${selectedColor.inventory} عدد از رنگ "${selectedColor.color}" موجود است.`,
            };
        }

        // ۲. سبد خرید فعلی کاربر را پیدا می‌کنیم
        let cart = await prisma.purchaseOrder.findFirst({
            where: {
                storeOwnerId: userId,
                status: "LOADING",
            },
            include: {
                items: true,
            },
        });
        // ۳. اگر سبد خریدی وجود نداشت، یکی جدید ایجاد می‌کنیم
        if (!cart) {
            cart = await prisma.purchaseOrder.create({
                data: {
                    storeOwnerId: userId,
                    status: "LOADING",
                    totalPrice: 0, // قیمت کل در ابتدا صفر است
                },
                include: {
                    items: true
                },
            });
        }


        // ۴. چک می‌کنیم آیا این محصول با همین مشخصات (colorsSelect) قبلاً در سبد بوده یا نه
        const existingItem = cart.items.find(
            (item) => item.productId === data.productId && item.colorsSelect === data.colorsSelect
        );

        if (existingItem) {
            // 👇 رفع باگ: بررسی موجودی برای تعداد کل جدید
            const newTotalQuantity = existingItem.quantity + data.quantity;
            if (selectedColor.inventory < newTotalQuantity) {
                return { success: false, error: true, message: `موجودی کافی نیست. حداکثر ${selectedColor.inventory} عدد از این محصول می‌توانید سفارش دهید.` };
            }
            // اگر بود، تعدادش را آپدیت می‌کنیم
            await prisma.purchaseOrderItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: {
                        increment: data.quantity, // تعداد جدید را اضافه می‌کنیم
                    },
                    totalPrice: {
                        increment: data.quantity * unitPrice,
                    },
                },
            });
        } else {
            // اگر آیتم جدید است، فقط موجودی را برای تعداد درخواستی چک کن
            if (selectedColor.inventory < data.quantity) {
                return { success: false, error: true, message: `حداکثر ${selectedColor.inventory} عدد از این محصول موجود است.` };
            }
            // اگر نبود، یک آیتم سفارش جدید ایجاد می‌کنیم و به سبد خرید متصل می‌کنیم
            await prisma.purchaseOrderItem.create({
                data: {
                    orderId: cart.id,
                    productId: data.productId,
                    quantity: data.quantity,
                    colorsSelect: data.colorsSelect,
                    unitPrice: unitPrice,
                    totalPrice: data.quantity * unitPrice,
                },
            });
        }
        // ۵. قیمت کل سبد خرید را مجدداً محاسبه و آپدیت می‌کنیم
        const updatedCartItems = await prisma.purchaseOrderItem.findMany({
            where: { orderId: cart.id },
            select: { totalPrice: true },
        });

        const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.totalPrice, 0);

        await prisma.purchaseOrder.update({
            where: { id: cart.id },
            data: {
                totalPrice: newTotalPrice,
            },
        });

        revalidatePath("/cart"); // مسیر صفحه سبد خرید را revalidate می‌کنیم



        // بعد از آپدیت یا ایجاد آیتم
        const newItem = await prisma.purchaseOrderItem.findFirst({
            where: {
                orderId: cart.id,
                productId: data.productId,
                colorsSelect: data.colorsSelect,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        priceWithProfit: true,
                        productImage: true,
                        priceOffer: true,
                        price: true
                    },
                },
            },
        });

        return { success: true, data: newItem, message: "اضافه شد", error: false };
    } catch (error) {
        console.error(error);
        return { success: false, message: "خطا در اضافه کردن به لیست خرید", error: true };
    }
}

/**
 * تابع برای به‌روزرسانی تعداد یا حذف یک آیتم در سبد خرید
 */
export async function updateCartItem({
    clientSideId,
    quantity,
}: {
    clientSideId: string;
    quantity: number;

}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) throw new Error("کاربر شناسایی نشد.");

        const [productId, colorsSelect] = clientSideId.split("-");
        const cart = await prisma.purchaseOrder.findFirst({
            where: { storeOwnerId: session.user.id, status: "LOADING" },
            include: { items: true },
        });

        if (!cart) throw new Error("سبد خرید یافت نشد.");

        const item = cart.items.find(
            (i) => i.productId === productId && i.colorsSelect === colorsSelect
        );
        if (!item) throw new Error("آیتم مورد نظر در سبد خرید یافت نشد.");

        if (quantity <= 0) {
            // حذف آیتم
            await prisma.purchaseOrderItem.delete({ where: { id: item.id } });

            // 🔥 چک کن آیا سبد خرید خالی شد؟
            const remainingItems = await prisma.purchaseOrderItem.count({
                where: { orderId: cart.id },
            });

            if (remainingItems === 0) {
                // اگر دیگه آیتمی نبود، خود سبد خرید هم حذف کن
                await prisma.purchaseOrder.delete({
                    where: { id: cart.id },
                });
                revalidatePath("/cart");
                return { success: true, message: "سبد خرید خالی و حذف شد." };
            }
        }
        else {
            // به‌روزرسانی تعداد
            const product = await prisma.product.findUnique({
                where: { id: productId },
                select: { priceWithProfit: true, priceOffer: true },
            });
            const basePrice = product?.priceWithProfit;
            if (!basePrice) throw new Error("قیمت محصول مشخص نشده است.");

            const unitPrice =
                product?.priceOffer && product.priceOffer > 0
                    ? basePrice - (basePrice * product.priceOffer) / 100
                    : basePrice;

            await prisma.purchaseOrderItem.update({
                where: { id: item.id },
                data: {
                    quantity,
                    totalPrice: quantity * unitPrice,
                },
            });
        }

        // به‌روزرسانی قیمت کل سبد خرید
        const updatedCartItems = await prisma.purchaseOrderItem.findMany({
            where: { orderId: cart.id },
            select: { totalPrice: true },
        });
        const newTotalPrice = updatedCartItems.reduce((sum, item) => sum + item.totalPrice, 0);

        await prisma.purchaseOrder.update({
            where: { id: cart.id },
            data: { totalPrice: newTotalPrice },
        });

        revalidatePath("/cart");
        return { success: true, message: "سبد خرید به‌روزرسانی شد." };
    } catch (error) {
        console.error("Error updating cart item:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("خطا در به‌روزرسانی سبد خرید.");
    }
}


