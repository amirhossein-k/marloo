"use client";
import React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // استایل پیش‌فرض

interface CustomEditorProps {
  html: string;
  setHtml: (content: string) => void;
}

const CustomEditor = ({ html, setHtml }: CustomEditorProps) => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">ویرایشگر متن SunEditor</h1>
      <SunEditor
        setContents={html} // مقدار اولیه
        onChange={setHtml} // هنگام تغییر مقدار
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["bold", "italic", "underline", "strike"],
            ["fontSize", "fontColor", "hiliteColor"],
            ["align", "list", "table"],
            ["link", "image", "video"],
            ["fullScreen", "showBlocks", "codeView"],
          ],
          height: "300px",
        }}
      />

      {/* پیش‌نمایش HTML با استایل سفارشی */}
      <div className="mt-4 p-4 border bg-gray-100">
        <h2 className="font-semibold mb-2">پیش‌نمایش:</h2>
        <div
          className="preview-content space-y-2 text-gray-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default CustomEditor;
