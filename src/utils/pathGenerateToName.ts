export function pathGenerateToName(path: string): string {
    // حذف query string یا hash
    const cleanPath = path.split("?")[0].split("#")[0];

    switch (cleanPath) {
        case "/":
            return "خانه";
        case "/products/list":
            return "لیست محصول";
        default:
            // اگر مسیر با "/products/" شروع بشه و بعدش یه id داشته باشه
            if (cleanPath.startsWith("/products/")) {
                return "صفحه محصول";
            }
            return "نامشخص"; // حالت fallback
    }
}
