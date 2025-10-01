export function makeDigikalaSearchUrl(query: string): string {
    if (!query) return "https://www.digikala.com/search/";
    return `https://www.digikala.com/search/?q=${query.trim().replace(/\s+/g, "+")}`;
}
