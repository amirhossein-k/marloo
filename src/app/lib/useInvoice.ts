
// src\app\lib\useInvoice.ts
import { CartItem } from "@/store/orderSlice";
import { actionsGetRes } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface Invoice {
    totalReq: number
    packaging: number
    tax: number
    discount: number
    total: number
    posting: number
}

const fetchInvoice = async (items: CartItem[], total: number): Promise<actionsGetRes<Invoice>> => {

    console.log(items, 'items fetchInvoice')
    console.log(total, 'total fetchInvoice')
    const res = await fetch('/api/products/checkout/preview', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, total })
    })

    if (!res.ok) throw new Error('فاکتور دریافت نشد')

    return res.json()
}



// const fetchInvoiceTablePage = async (cart: orderedProduct[]): Promise<InvoiceTablePageResponse> => {

//     const res = await fetch('/api/products/price', {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ items: cart })
//     })

//     if (!res.ok) throw new Error('فاکتور دریافت نشد')

//     return res.json()
// }

export function useInvoice(items: CartItem[], total: number) {
    return useQuery({
        queryKey: ['invoice', items],
        queryFn: () => fetchInvoice(items, total),
        enabled: items.length > 0
    })
}
// export function useInvoiceTablePage(cart: orderedProduct[]) {
//     return useQuery({
//         queryKey: ['invoice', cart],
//         queryFn: () => fetchInvoiceTablePage(cart),
//         enabled: cart.length > 0
//     })
// }