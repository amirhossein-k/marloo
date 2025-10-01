"use client";

import { useState, useEffect } from "react";
import { getBrandsModelsVariants } from "@/app/actions/bmv/bmv";

interface Variant {
  id: string;
  color: string;
  inventory: number;
}

interface Model {
  id: string;
  name: string;
  variants: Variant[];
}

interface Brand {
  id: string;
  name: string;
  models: Model[];
}

interface SelectedData {
  [brandId: string]: {
    [modelId: string]: string[];
  };
}

interface Props {
  onSelectData: (data: SelectedData) => void;
}

export default function MultiBrandModelVariantSelect({ onSelectData }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedData>({});

  useEffect(() => {
    async function fetchData() {
      const data = await getBrandsModelsVariants();
      setBrands(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    onSelectData(selectedData);
  }, [selectedData]);

  const toggleVariant = (
    brandId: string,
    modelId: string,
    variantId: string
  ) => {
    setSelectedData((prev) => {
      const brand = prev[brandId] || {};
      const variants = brand[modelId] || [];

      const updatedVariants = variants.includes(variantId)
        ? variants.filter((v) => v !== variantId)
        : [...variants, variantId];

      return {
        ...prev,
        [brandId]: {
          ...brand,
          [modelId]: updatedVariants,
        },
      };
    });
  };

  const toggleModel = (brandId: string, modelId: string) => {
    setSelectedData((prev) => {
      const brand = prev[brandId] || {};
      if (brand[modelId]) {
        // اگر مدل قبلاً انتخاب شده، پاکش کن
        const { [modelId]: _, ...restModels } = brand;
        return { ...prev, [brandId]: restModels };
      } else {
        return { ...prev, [brandId]: { ...brand, [modelId]: [] } };
      }
    });
  };

  const toggleBrand = (brandId: string) => {
    setSelectedData((prev) => {
      if (prev[brandId]) {
        const { [brandId]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [brandId]: {} };
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 border rounded-lg shadow-sm bg-white max-w-xl">
      {brands.map((brand) => {
        const brandSelected = !!selectedData[brand.id];
        return (
          <div key={brand.id} className="border-b pb-3 mb-3">
            <button
              type="button"
              onClick={() => toggleBrand(brand.id)}
              className={`font-semibold text-lg mb-2 ${
                brandSelected ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {brand.name}
            </button>
            {brandSelected && (
              <div className="ml-4 flex flex-col gap-3">
                {brand.models.map((model) => {
                  const modelSelected = !!selectedData[brand.id][model.id];
                  return (
                    <div key={model.id} className="ml-2">
                      <button
                        type="button"
                        onClick={() => toggleModel(brand.id, model.id)}
                        className={`font-medium mb-1 ${
                          modelSelected ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {model.name}
                      </button>
                      {modelSelected && (
                        <div className="flex flex-wrap gap-2 ml-4">
                          {model.variants.map((v) => {
                            const selectedVariants =
                              selectedData[brand.id][model.id];
                            const variantSelected = selectedVariants.includes(
                              v.id
                            );
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() =>
                                  toggleVariant(brand.id, model.id, v.id)
                                }
                                className={`px-3 py-1 rounded border ${
                                  variantSelected
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                              >
                                {v.color} ({v.inventory})
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
