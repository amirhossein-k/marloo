"use client";

interface Props {
  rows: number;
  setRows: (v: number) => void;
  columns: number;
  setColumns: (v: number) => void;
  tableData: string[][];
  setTableData: (v: string[][]) => void;
}

const TableAdd = ({
  rows,
  setRows,
  columns,
  setColumns,
  tableData,
  setTableData,
}: Props) => {
  return (
    <>
      {/* فیلدهای ورودی برای تعداد ردیف و ستون */}
      <div>
        <label className="block mb-2">تعداد ردیف‌ها:</label>
        <input
          type="number"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">تعداد ستون‌ها:</label>
        <input
          type="number"
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* فیلدهای ورودی برای سلول‌های جدول */}
      {rows > 0 && columns > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">ورود داده‌های جدول</h2>
          {tableData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-2 mb-2">
              {row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={cell}
                  onChange={(e) => {
                    const newTableData = [...tableData];
                    newTableData[rowIndex][colIndex] = e.target.value;
                    setTableData(newTableData);
                  }}
                  className="w-full p-2 border rounded"
                  placeholder={`ردیف ${rowIndex + 1}, ستون ${colIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TableAdd;
