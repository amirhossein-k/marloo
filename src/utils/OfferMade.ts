export function calculatePercentage(percent: number, valueStr: string): number {
  const value = parseFloat(valueStr);
  if (isNaN(value)) {
    throw new Error("مقدار ورودی رشته‌ای معتبر نیست");
  }
  return  value - (value * (percent / 100));
}
