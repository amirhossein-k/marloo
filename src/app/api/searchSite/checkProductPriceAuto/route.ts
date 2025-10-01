// src/app/api/checkProductPrice/route.ts
import * as puppeteer from 'puppeteer';

export async function POST(req: Request) {
    const { productName } = await req.json();

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

        // استخراج نزدیک‌ترین محصول
        const product = await page.evaluate((productName) => {
            const items = Array.from(document.querySelectorAll('.product-list_ProductList__item__LiiNI'));

            // پیدا کردن محصول با بیشترین شباهت به نام
            let bestMatch = null;
            let bestScore = 0;

            items.forEach(item => {
                const name = item.querySelector('div:nth-child(2) > h3')?.textContent?.trim() || '';
                const price = item.querySelector('span[data-testid="price-final"]')?.textContent?.trim() || null;
                const link = item.querySelector('a')?.getAttribute('href') || null;

                // محاسبه شباهت ساده (تعداد حروف مشترک پشت سر هم)
                const score = name.toLowerCase().includes(productName.toLowerCase()) ? name.length : 0;

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = { name, price, link: link ? `https://www.digikala.com${link}` : null };
                }
            });

            return bestMatch;
        }, productName);

        await browser.close();

        if (!product) {
            return new Response(JSON.stringify({ message: 'محصولی پیدا نشد' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ product }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'خطا در بررسی قیمت محصول' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// فقط نزدیک‌ترین محصول به نام شما را برمی‌گرداند.

// شامل نام محصول، قیمت و لینک آن است.

// مناسب برای مقایسه سریع قیمت محصول شما با دیجی‌کالا.

// می‌توان الگوریتم تشخیص شباهت را بهتر کرد (مثلاً با Levenshtein distance) برای دقت بالاتر.