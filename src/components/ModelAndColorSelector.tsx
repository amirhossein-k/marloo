"use client";

import { useState } from "react";
import type { FormattedPostType, Model, Variant } from "@/types";

export default function ModelAndColorSelector({
  product,
}: {
  product: FormattedPostType;
}) {
  const variants: Variant[] = (product.productVariants ?? [])
    .map((v) => v.variant)
    .filter(Boolean) as Variant[];

  const models: Model[] = Array.from(
    new Map(
      variants.filter((v) => v.model).map((v) => [v.model!.id, v.model!])
    ).values()
  );

  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const filteredVariants = selectedModel
    ? variants.filter((v) => v.modelId === selectedModel.id)
    : [];

  // تابع کمکی برای تعیین رنگ متن بر اساس روشنایی پس‌زمینه
  const getTextColor = (bgColor: string) => {
    if (!bgColor.startsWith("#")) return "#000";
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "#000" : "#fff";
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: "1rem",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        {product.title}
      </h2>

      {/* انتخاب مدل */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>انتخاب مدل:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {models.map((model) => (
            <button
              key={model.id}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor:
                  selectedModel?.id === model.id ? "#4CAF50" : "#f9f9f9",
                color: selectedModel?.id === model.id ? "#fff" : "#333",
                cursor: "pointer",
                boxShadow:
                  selectedModel?.id === model.id
                    ? "0 4px 8px rgba(0,0,0,0.2)"
                    : "none",
                transition: "all 0.2s",
              }}
              onClick={() => {
                setSelectedModel(model);
                setSelectedVariant(null);
              }}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* انتخاب رنگ */}
      {selectedModel && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "0.5rem" }}>انتخاب رنگ:</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {filteredVariants.map((variant) => (
              <button
                key={variant.id}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border:
                    selectedVariant?.id === variant.id
                      ? "2px solid #000"
                      : "1px solid #ccc",
                  backgroundColor: variant.color,
                  color: getTextColor(variant.color),
                  cursor: "pointer",
                  boxShadow:
                    selectedVariant?.id === variant.id
                      ? "0 4px 8px rgba(0,0,0,0.2)"
                      : "none",
                  transition: "all 0.2s",
                }}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.inventory} موجود
              </button>
            ))}
          </div>
        </div>
      )}

      {/* نمایش اطلاعات انتخاب شده */}
      {selectedVariant && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f1f1f1",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ marginBottom: "0.5rem" }}>جزئیات انتخاب:</h4>
          <p>
            مدل: <strong>{selectedModel?.name}</strong>
          </p>
          <p>
            رنگ: <strong>{selectedVariant.color}</strong>
          </p>
          <p>
            موجودی: <strong>{selectedVariant.inventory}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
