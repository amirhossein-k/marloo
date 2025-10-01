"use client";

import { deleteItem } from "@/app/actions/bmv/addBmv";
import {
  BrandWithModels,
  GetBrands,
  GetModelsALL,
  GetVariantsALL,
  ModelWithBrandAndVariants,
  VariantWithModelAndBrand,
} from "@/app/actions/bmv/bmv";
import { actionsGetRes } from "@/types";
import type { Brand, Model, Variant } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const fetchMap = {
  brands: GetBrands,
  models: GetModelsALL,
  variant: GetVariantsALL,
};

type ItemMap = {
  brands: Brand;
  models: Model;
  variant: Variant;
};

interface ModalProps {
  isOpen: {
    name: "brands" | "models" | "variant";
    open: boolean;
  };

  onCancel: () => void;
  title: string;
}

const ModalMbv = ({
  isOpen,

  onCancel,
  title,
}: ModalProps) => {
  const queryClient = useQueryClient();
  // بارگذاری برندها
  const {
    data: brands,
    isLoading: isLoadingBrands,
    error: brandsError,
  } = useQuery<actionsGetRes<BrandWithModels[]>>({
    queryKey: ["brands"],
    queryFn: GetBrands,
    staleTime: 5 * 60 * 1000,
  });

  // یک mutation برای همه

  const mutation = useMutation({
    mutationFn: ({
      type,
      id,
    }: {
      type: "brand" | "model" | "variant";
      id: string;
    }) => deleteItem(type, id),
    onMutate: () => {
      const toastId = toast.loading("درحال حذف ایتم...");
      return { toastId };
    },
    onSuccess: (_, variables, context) => {
      toast.dismiss(context?.toastId);
      toast.success("ایتم حذف شد.");
      queryClient.invalidateQueries({ queryKey: [variables.type + "s"] });
      // باطل کردن کش‌های وابسته
      if (variables.type === "brand") {
        queryClient.invalidateQueries({ queryKey: ["models"] });
        queryClient.invalidateQueries({ queryKey: ["variants"] });
      } else if (variables.type === "model") {
        queryClient.invalidateQueries({ queryKey: ["variants"] });
      }
    },
    onError: (error, _, context) => {
      toast.dismiss(context?.toastId);
      toast.error(`خطا در حذف :${error.message}`);
    },
  });
  // بارگذاری مدل‌ها (وابسته به برند)
  const {
    data: models,
    isLoading: isLoadingModels,
    error: modelsError,
  } = useQuery<actionsGetRes<ModelWithBrandAndVariants[]>>({
    queryKey: ["models"],
    queryFn: () => GetModelsALL(),
    staleTime: 5 * 60 * 1000,
  });

  // بارگذاری واریانت‌ها (وابسته به مدل)
  const {
    data: variants,
    isLoading: isLoadingVariants,
    error: variantsError,
  } = useQuery<actionsGetRes<VariantWithModelAndBrand[]>>({
    queryKey: ["variants"],
    queryFn: () => GetVariantsALL(),
    staleTime: 5 * 60 * 1000,
  });

  // داینامیک لود دیتا
  // const { data } = useQuery<actionsGetRes<ItemMap[typeof isOpen.name][]> >({
  //     queryKey: [isOpen.name],
  //     queryFn: fetchMap[isOpen.name],
  //     enabled: isOpen.open,
  // });
  if (!isOpen.open) return null;

  const renderList = () => {
    switch (isOpen.name) {
      case "brands":
        if (isLoadingBrands) {
          <>لطفا صبر کنید...</>;
        } else {
          return (
            brands?.success &&
            brands.data.map((brand) => (
              <li
                key={brand.id}
                className="shadow-md flex justify-between items-center py-2"
              >
                <span>{brand.name}</span>
                <button
                  onClick={() =>
                    mutation.mutate({ type: "brand", id: brand.id })
                  }
                  className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={mutation.isPending}
                >
                  حذف
                </button>
              </li>
            ))
          );
        }
      case "models":
        if (isLoadingModels) {
          <>لطفا صبر کنید...</>;
        } else {
          return (
            models?.success &&
            models.data.map((model) => (
              <li
                key={model.id}
                className="shadow-md flex justify-between items-center py-2"
              >
                <span>{model.name}</span>
                <span>برند:{model.brand?.name} </span>
                <button
                  onClick={() =>
                    mutation.mutate({ type: "model", id: model.id })
                  }
                  className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={mutation.isPending}
                >
                  حذف
                </button>
              </li>
            ))
          );
        }
      case "variant":
        if (isLoadingVariants) {
          <>لطفا صبر کنید...</>;
        } else {
          return (
            variants?.success &&
            variants.data.map((variant) => (
              <li
                key={variant.id}
                className="shadow-md flex justify-between items-center py-2"
              >
                <div className="flex gap-4 justify-center items-center">
                  <span
                    className="block w-4 h-4 rounded-md"
                    style={{ backgroundColor: variant.color }}
                  ></span>
                  {variant.color}
                </div>
                <span>برند:{variant.model?.name} </span>
                <button
                  onClick={() =>
                    mutation.mutate({ type: "variant", id: variant.id })
                  }
                  className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={mutation.isPending}
                >
                  حذف
                </button>
              </li>
            ))
          );
        }
    }
  };

  console.log(title, "title");
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-[70%]">
        <p className="mb-4 text-red-500 text-xl">{title}</p>
        <div className="flex gap-4 justify-center my-2 max-h-[400px] w-full  overflow-y-auto">
          {/* {listRended()} */}
          <ul className="flex flex-col gap-3 w-full">{renderList()}</ul>
        </div>
        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded text-black text-xl"
        >
          انصراف
        </button>
      </div>
    </div>
  );
};

export default ModalMbv;
