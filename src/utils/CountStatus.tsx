import React, { JSX } from "react";

export function renderCountStatus(countStr: string): JSX.Element {
  const num = parseInt(countStr, 10);

  if (isNaN(num)) {
    return <div style={{ color: "gray" }}>مقدار نامعتبر</div>;
  }

  if (num < 10) {
    return <div className="text-red-300">در حال اتمام است ,{countStr} باقی مانده است</div>;
  }

  return <div />;
}
