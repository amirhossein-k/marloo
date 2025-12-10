const categoryMap: Record<string, string> = {
    "mobile": "موبایل",
    "lavazemKhane": "لوازم خانه",
    "dekori": "لوازم دکوری",
    "qhab": "قاب ها",
    // هر دسته دیگری که داری را اضافه کن
};
export async function getCategoryPersian(englishCategory: string): Promise<string> {
    return categoryMap[englishCategory] || englishCategory;
}
