"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputField from "../Input/InputField";

interface Region {
  name: string;
  cities: string[];
}

interface Props {
  labels?: {
    name?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    des?: string;
  };
  placeholders?: {
    name?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    des: string;
  };
  onChange?: (value: {
    name: string;
    city: string;
    address: string;
    zipCode: string;
    des: string;
  }) => void;
}

const ProvinceCitySelect: React.FC<Props> = ({
  labels = {
    name: "استان",
    city: "شهر",
    address: "ادرس محل تحویل",
    zipCode: "کد پستی",
    // des: "   توضیحات",
  },
  placeholders = {
    name: "انتخاب استان",
    city: "انتخاب شهر",
    address: "...ادرس محل تحویل",
    zipCode: "کد پستی",
    des: "توضحیحات...",
  },
  onChange,
}) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [prov, setProv] = useState("");
  const [city, setCity] = useState("");
  const [addresss, setAdresss] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [des, setDes] = useState("");

  useEffect(() => {
    import("@/data/iran.json").then((mod) => setRegions(mod.default));
  }, []);

  useEffect(() => {
    onChange?.({ name: prov, city, address: addresss, zipCode, des });
  }, [prov, city, addresss, zipCode, des]);

  const cities = regions.find((r) => r.name === prov)?.cities || [];

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Select برای استان */}

      <div className="relative">
        {/* <label
          className={`absolute right-2 -top-5 text-gray-400 text-sm transition-all 
      ${
        prov ? "top-0 text-blue-400 text-sm" : "-top-6 text-gray-500 text-base"
      }`}
        >
          {labels.name}
        </label> */}
        <Select onValueChange={setProv} value={prov}>
          <SelectTrigger className="h-[56px] w-full border-b-2 border-gray-500 bg-gray-800 px-3 pb-2 pt-6 text-white outline-none transition-colors focus:border-blue-500 items-end">
            <SelectValue placeholder={placeholders.name} />
          </SelectTrigger>
          <label
            className={`pointer-events-none absolute right-3 text-gray-400 transition-all duration-200
              ${
                prov
                  ? "top-2 text-xs text-blue-400"
                  : "top-1/2 -translate-y-1/2 text-base"
              }`}
          >
            {labels.name}
          </label>
          <SelectContent className="bg-gray-800 text-white rounded shadow-md mt-1">
            {regions.map((r) => (
              <SelectItem key={r.name} value={r.name}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Select برای شهر */}
      <div className="relative">
        <Select onValueChange={setCity} value={city} disabled={!prov}>
          <SelectTrigger
            className="h-[56px] w-full border-b-2 border-gray-500 bg-gray-800 px-3 pb-2 pt-6 text-white outline-none transition-colors focus:border-blue-500 items-end"
            disabled={!prov}
          >
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <label
            className={`pointer-events-none absolute right-3 text-gray-400 transition-all duration-200
              ${
                city
                  ? "top-2 text-xs text-blue-400"
                  : "top-1/2 -translate-y-1/2 text-base"
              }`}
          >
            {labels.city}
          </label>
          <SelectContent className="bg-gray-800 text-white rounded shadow-md mt-1">
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* فیلدهای آدرس و کد پستی */}

      <div className="flex flex-col md:flex-row">
        <InputField
          label={labels.address ?? "ادرس"}
          id="adress"
          value={addresss}
          onChange={(e) => setAdresss(e.target.value)}
          required
        />
        {/* <label htmlFor="">{labels.address}</label>
        <input
          type="text"
          placeholder={placeholders.address}
          onChange={(e) => setAdresss(e.target.value)}
        /> */}
      </div>
      <div className="">
        <InputField
          label={labels.zipCode ?? "کدپستی"}
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          required
        />
      </div>
      <div className="">
        <InputField
          label={labels.des ?? "توضیحات"}
          id="des"
          value={des}
          onChange={(e) => setDes(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ProvinceCitySelect;
