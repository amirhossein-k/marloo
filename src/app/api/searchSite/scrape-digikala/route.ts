// src/app/api/searchSite/scrape-digikala/route.ts
import * as puppeteer from 'puppeteer';

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
    const { site } = await req.json();
    const URL = site ? encodeURI(site) : 'https://www.digikala.com/search/?q=قاب+گوشی';

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // تنظیم User-Agent و زبان
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        );
        await page.setExtraHTTPHeaders({
            'accept-language': 'fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7',
        });

        console.log('در حال باز کردن صفحه...');
        await page.goto(URL, { waitUntil: 'networkidle2' });

        // اسکرول کردن تا لود کامل محصولات
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // صبر کوتاه بعد از اسکرول برای اطمینان از لود کامل
        await delay(2000);

        // استخراج اطلاعات محصولات
        const products = await page.evaluate(() => {
            const container = document.querySelector(
                '.product-list_ProductList__pagesContainer__zAhrX'
            );
            if (!container) return [];

            return Array.from(container.querySelectorAll('.product-list_ProductList__item__LiiNI')).map(
                (product) => {
                    const name = product.querySelector('div:nth-child(2) > h3')?.textContent?.trim() || null;
                    const price =
                        product.querySelector('span[data-testid="price-final"]')?.textContent?.trim() || null;
                    return { name, price };
                }
            );
        });

        await browser.close();

        return new Response(JSON.stringify({ products }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'خطا در اسکرپ کردن صفحه' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
