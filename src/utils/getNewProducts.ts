type Product = {
    id: string;
    title: string;
    createdAt: string; // تاریخ ذخیره شده (ISO یا string)
    // بقیه فیلدهای محصول
};

export function getNewProducts(products: Product[]): Product[] {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    return products.filter((product) => {
        const productDate = new Date(product.createdAt);
        return productDate >= oneMonthAgo;
    });
}
