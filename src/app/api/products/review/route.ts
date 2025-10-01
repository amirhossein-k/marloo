import { NextResponse } from 'next/server';
import { db as prisma } from '@/app/lib/db';

export async function GET(request: Request) {
  try {
    // دریافت productId از query string
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    // اعتبارسنجی productId
    if (!productId) {
      return NextResponse.json(
        { error: 'شناسه محصول الزامی است' },
        { status: 400 }
      );
    }

    // بررسی وجود محصول
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    // دریافت نظرات مرتبط با محصول
    const reviews = await prisma.reviewList.findMany({
      where: { ownerId: productId },
      select: {
        id: true,
        reviewText: true,
        name: true,
        email: true,
        rating: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }, // مرتب‌سازی بر اساس تاریخ (جدیدترین ابتدا)
    });

    return NextResponse.json(reviews, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('خطا در دریافت نظرات:', error);
    return NextResponse.json(
      { error: 'خطای سرور رخ داد' },
      { status: 500 }
    );
  }
}
