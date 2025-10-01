//    src\utils\generateTableHTML.ts
// تبدیل tableData به HTML
export const generateTableHTML = (tableData: string[][]) => {
    // بررسی خالی بودن یا تعریف‌نشده بودن tableData
    if (!tableData || tableData.length === 0 || tableData.every(row => row.every(cell => cell === ''))) {
        return ''; // رشته خالی در صورت نبود داده
    }

    // تولید HTML جدول
    // استفاده از کلاس‌های Tailwind برای جدول
    let tableHTMLe = `
    <table class="table-auto w-full border-collapse border border-gray-300 text-sm">
      <tbody>
  `;
    tableData.forEach(row => {
        tableHTMLe += '<tr class="odd:bg-gray-50">';
        row.forEach(cell => {
            tableHTMLe += `<td class="border border-gray-300 px-4 py-2 text-gray-800">${cell}</td>`;
        });
        tableHTMLe += '</tr>';
    });
    tableHTMLe += `
      </tbody>
    </table>
  `;
    return tableHTMLe;
};