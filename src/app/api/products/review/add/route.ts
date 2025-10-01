import { NextResponse } from 'next/server';
import { db as prisma } from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { fetchUser, USERTYPE } from '@/app/actions/GetUser';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { productId, name, email, reviewText, rating } = await request.json();

    // اعتبارسنجی ورودی‌ها
    if (!productId || !name || !reviewText || rating === undefined) {
      return NextResponse.json(
        { error: 'تمامی فیلدها (productId, name, email, reviewText, rating) الزامی هستند' },
        { status: 400 }
      );
    }

    // بررسی وجود محصول
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'محصول یافت نشد' }, { status: 404 });
    }

    // گرفتن session از NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'لطفاً ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    // دریافت اطلاعات کاربر از DB
    const user: USERTYPE | null = await fetchUser(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    // ایجاد نظر جدید
    const newReview = await prisma.reviewList.create({
      data: {
        reviewText,
        name: user.name || name,
        email: email,
        ownerId: productId,
        rating
      },
      select: {
        id: true,
        reviewText: true,
        name: true,
        email: true,
        createdAt: true,
        rating: true
      }
    });

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('خطا در افزودن نظر:', error);
    return NextResponse.json({ error: 'خطای سرور رخ داد' }, { status: 500 });
  }
}
