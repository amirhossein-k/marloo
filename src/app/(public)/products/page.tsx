// app/(public)/products/page.tsx

import { GetProduct } from "@/app/actions/product/GetProductList";
import ProductList from "@/components/product/ProductList";
// import ProductList from "../../components/products/ProductList";

// import { getProducts } from '@/lib/api/products';
import { FormattedPostType } from "@/types";

export default async function ProductsPage() {
  let products: FormattedPostType[] = [];

  try {
    products = await GetProduct();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">همه محصولات</h1>
      <ProductList products={products} />
    </div>
  );
}
