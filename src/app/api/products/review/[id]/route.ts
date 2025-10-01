// src/app/api/products/review/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // مسیر تنظیمات NextAuth
import { USERTYPEPrisma } from '@/types';
import { fetchUser, GetUser } from '@/app/actions/GetUser';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;
    if (!reviewId) {
      return NextResponse.json({ error: 'شناسه نظر الزامی است' }, { status: 400 });
    }

    // گرفتن session کاربر با NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'لطفاً ابتدا وارد حساب کاربری خود شوید' }, { status: 401 });
    }

    // دریافت اطلاعات کامل کاربر از DB
    const user = await fetchUser(session.user.id);
    if (!user) return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });

    if (!user.admin) return NextResponse.json({ error: 'فقط ادمین‌ها می‌توانند نظرات را حذف کنند' }, { status: 403 });

    const review = await prisma.reviewList.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: 'نظر یافت نشد' }, { status: 404 });
    }

    await prisma.reviewList.delete({ where: { id: reviewId } });

    return NextResponse.json({ message: 'نظر با موفقیت حذف شد' }, { status: 200 });
  } catch (error) {
    console.error('❌ خطا در حذف نظر:', error);
    return NextResponse.json({ error: 'خطای سرور رخ داد' }, { status: 500 });
  }
}
