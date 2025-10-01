const persianNumbers = {
  zero: 'صفر',
  ones: ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
  teens: [
    'ده', 'یازده', 'دوازده', 'سیزده', 'چهارده',
    'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'
  ],
  tens: ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
  hundreds: ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
  scale: ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون']
};

function threeDigitToWords(num: number): string {
  const result: string[] = [];
  const hundred = Math.floor(num / 100);
  const tenUnit = num % 100;

  if (hundred) result.push(persianNumbers.hundreds[hundred]);

  if (tenUnit >= 10 && tenUnit < 20) {
    result.push(persianNumbers.teens[tenUnit - 10]);
  } else {
    const ten = Math.floor(tenUnit / 10);
    const unit = tenUnit % 10;

    if (ten) result.push(persianNumbers.tens[ten]);
    if (unit) result.push(persianNumbers.ones[unit]);
  }

  return result.join(' و ');
}

export function num2persian(input: number | string): string {
  const numStr = String(input).replace(/,/g, '').trim();

  if (!/^\d+$/.test(numStr)) return '';

  if (numStr === '0') return persianNumbers.zero;

  const result: string[] = [];

  const num = parseInt(numStr, 10);
  const parts: number[] = [];
  let remaining = num;

  while (remaining > 0) {
    parts.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part !== 0) {
      const word = threeDigitToWords(part);
      const scale = persianNumbers.scale[i];
      result.push(`${word}${scale ? ' ' + scale : ''}`);
    }
  }

  return result.join(' و ');
}
