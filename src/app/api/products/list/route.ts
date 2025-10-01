import { db as prisma } from '@/app/lib/db'
import { NextResponse } from 'next/server'
// import { Post } from '@/app/(public)/products/page';
interface User {
  id: string
  email: string
  name: string
  posts: Post[]
  createdAt: string
}
interface PHOTO {
  id: string
  defaultImage: boolean
  childImage: string
  fileKey: string | null
  ownerId: string | null

}
export interface Post {
  id: string
  content?: string | null
  title: string
  published: boolean
  price: number
  author?: User
  authorId: string
  createdAt: Date
  updatedAt: Date
  productImage: PHOTO[]
}

export async function GET() {

  try {
    const listProduct: Post[] | undefined = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }, include: {
        productImage: true,
        colors: true
      }
    })
    if (listProduct) return NextResponse.json(listProduct)



  } catch (error) {
    console.log(error, 'error get listproduct error')
    return NextResponse.json(
      { error: 'خطا در سرور' },
      { status: 500 }
    );
  }
}