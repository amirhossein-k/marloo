import { orderedProduct } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient()
export async function POST(req: NextRequest) {



    const { items }: { items: orderedProduct[] } = await req.json()
    console.log(items, 'items')

    if (!Array.isArray(items) || items.length === 0) {
        NextResponse.json({ message: "سبد خرید خالی است", error: true, success: false }, { status: 400 })
    }

    try {

        let subtotal = 0
        // let oddTotal = 0

        const detailedItems = []

        for (const CartItem of items) {
            // هر محصول که کاربر انتخاب کرده ایجاد درسترسی میگیرم ان محصول خاص را
            // محصولی مه انتخاب کرده ایتم هاشو جمع میزنیم
            const post = await prisma.post.findUnique({
                where: {
                    id: CartItem.id
                },
                select: {
                    id: true, title: true, price: true, addOns: true, items: true
                }
            })
            console.log(post, 'postt')

            if (!post) {
                return NextResponse.json({ message: `Product not found: ${CartItem.id}` }, { status: 404 })
            }

    


            // محاسبه جمع ایتم های اضافه
            let odditemTotal = 0
            CartItem.addOns?.forEach((userAddOn) => {
                const matchedAddOn = post.addOns.find((a) => a.id === userAddOn.id);
                if (matchedAddOn) {
                    odditemTotal += matchedAddOn.price * userAddOn.quantity;
                }
            });
            
            
            
            // محاسبه هر کدام از نوع محصول در تعداد انتخاب شده
            const productTotal = post.items[0].price 
            if(CartItem.countOrder>= 2){
                const itemUptade =   productTotal * CartItem.countOrder
                const addOnsupdate =  odditemTotal * CartItem.countOrder

                subtotal += itemUptade
                subtotal += addOnsupdate

            }else{

                subtotal += odditemTotal
                subtotal += productTotal
            }




            detailedItems.push({
                ...post,
                countOrder: CartItem.countOrder,
                items: CartItem.items,
                addOns: CartItem.addOns,
                total: productTotal + odditemTotal,
                odditemTotal,
                idOrder: CartItem.idOrder
            })
        }

       

        const total = subtotal 
        return NextResponse.json(
            {
                items: detailedItems,
                subtotal,
               
                total,
                
            }, { status: 200 }
        )



    } catch (error) {
        console.log(error, 'error in cart price fetch')
        return NextResponse.json({ message: "مشکلی پیش اومده در سرور هنگام محسابه قیمت", error: true, success: false })
    }

}