// src\app\api\suppliers\route.ts

import { db as prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const suppliers = await prisma.supplier.findMany({
        select: { id: true, name: true, phone: true, address: true },
    });
    return NextResponse.json({ suppliers }, { status: 200 });
}
