"use client";

import { actionsGetRes } from "@/types";
import { Brand, Model, Variant } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ColorPickerMultiple from "../color/ColorPickerMultiple";
import { addBrand, addModel, addVariant } from "@/app/actions/bmv/addBmv";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ModalMbv from "./ModalMbv";

interface AddBmvProps {
  brands: actionsGetRes<Brand[]>;
  models: actionsGetRes<Model[]>;
  variants: actionsGetRes<Variant[]>;
  onChange?: (selection: { brandId: string | null }) => void;
}

const AddBmv = ({ brands, models, variants, onChange }: AddBmvProps) => {
  const queryClient = useQueryClient();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<{
    name: "brands" | "models" | "variant";
    open: boolean;
  }>({ name: "brands", open: false });

  const [colors, setColors] = useState<string[]>([]);
  const [primaryColor, setPrimaryColor] = useState<string | null>(null);

  // اطلاع‌رسانی انتخاب‌ها به والد
  useEffect(() => {
    onChange?.({
      brandId: selectedBrand,
    });
  }, [selectedBrand, onChange]);

  // اطلاع‌رسانی انتخاب‌ها به والد
  // Mutation برای افزودن برند
  const brandMutation = useMutation({
    mutationFn: (formData: FormData) => addBrand(formData),
    onMutate: () => {
      const toastId = toast.loading("در حال افزودن برند...");
      return { toastId };
    },
    onSuccess: (result, _, context) => {
      toast.dismiss(context?.toastId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        queryClient.invalidateQueries({ queryKey: ["models"] });
        queryClient.invalidateQueries({ queryKey: ["variants"] });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error, _, context) => {
      toast.dismiss(context?.toastId);
      toast.error(`خطا در افزودن برند: ${error.message}`);
    },
  });
  // مدیریت ارسال فرم مدل
  const modelMutation = useMutation({
    mutationFn: (formData: FormData) => addModel(formData),
    onMutate: () => {
      const toastId = toast.loading("در حال افزودن مدل...");
      return { toastId };
    },
    onSuccess: (result, variables, context) => {
      toast.dismiss(context?.toastId);
      if (result.success) {
        toast.success(result.message);
        const brandId = variables.get("brandId") as string;
        // باطل کردن کش‌های مدل‌ها و واریانت‌ها
        queryClient.invalidateQueries({ queryKey: ["models", brandId] });
        queryClient.invalidateQueries({ queryKey: ["models"] });
        queryClient.invalidateQueries({ queryKey: ["variants"] });
        setSelectedModel(null);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error, _, context) => {
      toast.dismiss(context?.toastId);
      toast.error(`خطا در افزودن مدل: ${error.message}`);
    },
  });

  // مدیریت ارسال فرم واریانت
  const variantMutation = useMutation({
    mutationFn: (formData: FormData) => {
      formData.append("colors", JSON.stringify(colors));
      return addVariant(formData);
    },
    onMutate: () => {
      const toastId = toast.loading("در حال افزودن رنگ و موجودی...");
      return { toastId };
    },
    onSuccess: (result, variables, context) => {
      toast.dismiss(context?.toastId);
      if (result.success) {
        toast.success(result.message);
        const modelId = variables.get("modelId") as string;
        // باطل کردن کش واریانت‌ها
        queryClient.invalidateQueries({ queryKey: ["variants", modelId] });
        queryClient.invalidateQueries({ queryKey: ["variants"] });
        setColors([]);
        setPrimaryColor(null);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error, _, context) => {
      toast.dismiss(context?.toastId);
      toast.error(`خطا در افزودن رنگ و موجودی: ${error.message}`);
    },
  });

  console.log(models, "models");
  console.log(brands, "brands");

  return (
    <div className=" mx-auto p-4  w-full " dir="rtl">
      {/* فرم اضافه کردن برند */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          brandMutation.mutate(new FormData(e.currentTarget));
        }}
        className="mb-6 flex-col md:flex-row flex gap-4"
      >
        <div className=" flex my-2 items-center gap-3 ">
          <label>نام برند:</label>
          <input
            type="text"
            name="name"
            className="border p-2 w-fit rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-sky-300 text-white w-fit mx-auto rounded-md py-2 px-3 mb-3 text-center"
          >
            اضافه کردن برند
          </button>
          <button
            type="button"
            onClick={() => setShowModal({ name: "brands", open: true })}
            className=" bg-blue-600 text-white mx-auto rounded-md py-2 px-3 mb-3 text-center hover:bg-sky-300"
          >
            لیست برندها
          </button>
        </div>
      </form>

      {/* فرم اضافه کردن مدل */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          modelMutation.mutate(new FormData(e.currentTarget));
        }}
        className="mb-6 w-full"
      >
        <div className=" flex flex-col my-2 items-center gap-3 w-full">
          <div className="w-full ">
            <label htmlFor="">برند</label>
            <select name="brandId" className="border p-2 rounded-md" required>
              {brands.data.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <label>نام مدل:</label>
            <input
              type="text"
              name="name"
              className="border p-2 rounded-md"
              required
            />
          </div>
          <div className="flex justify-start w-full bg-green-30">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-3 rounded-md  hover:bg-sky-300 cursor-pointer"
            >
              اضافه کردن مدل
            </button>
            <button
              type="button"
              onClick={() => setShowModal({ name: "models", open: true })}
              className=" bg-blue-600 text-white  rounded-md py-2 px-3 text-center hover:bg-sky-300 cursor-pointer"
            >
              لیست مدل ها
            </button>
          </div>
        </div>
      </form>

      {/* فرم اضافه کردن رنگ و موجودی */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          variantMutation.mutate(new FormData(e.currentTarget));
        }}
        className="mb-6   items-center justify-center"
      >
        <label htmlFor="">برند</label>
        <select
          name="brandId"
          className="border p-2 rounded-md"
          value={selectedBrand || ""}
          onChange={(e) => {
            setSelectedBrand(e.target.value || null);
            setSelectedModel(null);
          }}
          required
        >
          <option value="">انتخاب برند</option>
          {brands.data.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <div className="px-3 flex my-2 items-center gap-3">
          <label>مدل:</label>
          <select
            name="modelId"
            className="border p-2 rounded-md"
            onChange={(e) => setSelectedModel(e.target.value || null)}
            required
          >
            <option value="">انتخاب مدل</option>
            {models.data.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.name})
              </option>
            ))}
          </select>
        </div>
        <div className="px-4 flex my-2 items-center gap-3">
          <label>موجودی:</label>
          <input
            type="number"
            name="inventory"
            className="border p-2 rounded-md"
            required
          />
        </div>

        <ColorPickerMultiple
          initialPrimaryColor={primaryColor}
          initialColor={colors}
          onColorsChange={(newColors, newPrimaryColor) => {
            setColors(newColors);
            setPrimaryColor(newPrimaryColor);
          }}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-sky-300 cursor-pointer"
        >
          اضافه کردن رنگ و موجودی
        </button>
        <button
          onClick={() => setShowModal({ name: "variant", open: true })}
          className=" bg-blue-600 text-white mx-2 rounded-md py-2 px-3 mb-3 text-center hover:bg-sky-300 cursor-pointer"
        >
          لیست رنگ ها
        </button>
      </form>
      <ModalMbv
        title={
          showModal.name === "brands"
            ? "لیست برندها"
            : showModal.name === "models"
            ? "لیست مدل‌ها"
            : "لیست رنگ‌ها"
        }
        isOpen={showModal}
        onCancel={() => setShowModal({ name: showModal.name, open: false })}
      />
    </div>
  );
};

export default AddBmv;
