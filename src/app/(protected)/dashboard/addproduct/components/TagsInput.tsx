import React, { useState } from "react";

interface Props {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagsInput = ({ tags, setTags }: Props) => {
  const [input, setInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  return (
    <div>
      <label className="block mb-1">تگ‌ها:</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleAddTag}
        className="w-full p-2 border rounded"
        placeholder="تگ را وارد کرده و Enter بزنید"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 bg-gray-200 rounded text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
