// src/components/InputField.tsx
import React, { useState, useEffect } from "react";

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value?: string;
  placeholder?: { active: true; title: string };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type = "text",
  required = false,
  value = "",
  placeholder = { active: false, title: "" },
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="relative w-full md:max-w-full bg-red-400  max-w-md my-4"
      dir="rtl"
    >
      <input
        type={type}
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder.active ? placeholder.title : label}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`peer block w-full px-2 pt-6 pb-2 text-white bg-gray-800 rounded border-b-2 border-gray-500 focus:border-blue-500 outline-none transition-colors`}
      />
      <label
        htmlFor={id}
        className={`absolute right-2 ${
          placeholder.active
            ? "-top-40  peer-placeholder-shown:top-0"
            : "top-2  peer-placeholder-shown:top-6"
        } text-gray-400 text-sm transition-all 
          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
          ${isFocused || value ? "top-0 text-blue-400 text-sm" : ""}`}
      >
        {label}
      </label>
      <span className="absolute bottom-0 right-0 w-full h-0.5 bg-blue-400 scale-x-0 transition-transform origin-right peer-focus:scale-x-100"></span>
    </div>
  );
};

export default InputField;
