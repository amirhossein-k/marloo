// تابع کمکی برای تشخیص کد رنگ هگزادسیمال
// یک کد هگزادسیمال معتبر با # شروع شده و شامل 3 یا 6 کاراکتر (اعداد 0-9 و حروف a-f) است.
export const isHexColor = (color: string): boolean => {
    if (!color) return false;
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
};