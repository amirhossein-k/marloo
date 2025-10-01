// src/app/api/checkMultipleProductPrices/route.ts
import * as puppeteer from 'puppeteer';

export async function POST(req: Request) {
    const { productName, maxResults } = await req.json();
    const limit = maxResults && typeof maxResults === 'number' ? maxResults : 5; // حداکثر تعداد محصولات

    if (!productName) {
        return new Response(JSON.stringify({ error: 'نام محصول وارد نشده است' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const searchURL = `https://www.digikala.com/search/?q=${encodeURIComponent(productName)}`;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        );

        await page.goto(searchURL, { waitUntil: 'networkidle2' });

        // اسکرول برای لود کامل محصولات
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

        // استخراج اطلاعات چند محصول
        const products = await page.evaluate((limit) => {
            const items = Array.from(document.querySelectorAll('.product-list_ProductList__item__LiiNI')).slice(0, limit);

            return items.map(item => {
                const name = item.querySelector('div:nth-child(2) > h3')?.textContent?.trim() || null;
                const price = item.querySelector('span[data-testid="price-final"]')?.textContent?.trim() || null;
                const link = item.querySelector('a')?.getAttribute('href') || null;
                const image = item.querySelector('img')?.getAttribute('src') || null; // اضافه کردن تصویر

                return { name, image, price, link: link ? `https://www.digikala.com${link}` : null };
            });
        }, limit);

        await browser.close();

        if (!products.length) {
            return new Response(JSON.stringify({ message: 'محصولی پیدا نشد' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ products }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'خطا در بررسی محصولات' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// می‌توانید productName را ارسال کنید.

// می‌توانید با maxResults تعداد محصولاتی که می‌خواهید برگردانده شود مشخص کنید.

// خروجی شامل لیست محصولاتی است که نام، قیمت و لینک دارند.

// این نسخه برای مقایسه قیمت محصول خود با رقبا در دیجی‌کالا بسیار مناسب است.