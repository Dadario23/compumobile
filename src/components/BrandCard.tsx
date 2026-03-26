// src/components/BrandCard.tsx
"use client";

import type { Marca } from "@/lib/types";
import { MARCA_ICONS } from "@/lib/types";

const BRAND_COLORS: Record<Marca, string> = {
  Samsung:  "#1428A0",
  iPhone:   "#555555",
  Motorola: "#EB0000",
  Xiaomi:   "#FF6900",
  Huawei:   "#CF0A2C",
  Lg:       "#A50034",
  Nokia:    "#124191",
  Otro:     "#6366f1",
};

interface BrandCardProps {
  brand: Marca;
  selected: boolean;
  onClick: () => void;
}

export default function BrandCard({
  brand,
  selected,
  onClick,
}: BrandCardProps) {
  const color = BRAND_COLORS[brand];
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer w-full"
      style={{
        borderColor: selected ? color : "var(--border)",
        background: selected
          ? `color-mix(in srgb, ${color} 12%, var(--bg-card))`
          : "var(--bg-card)",
        boxShadow: selected ? `0 0 0 1px ${color}40` : "none",
        transform: selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      {selected && (
        <span
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: color }}
          aria-hidden
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M1.5 4L3 5.5L6.5 2"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <span className="text-3xl">{MARCA_ICONS[brand]}</span>
      <span
        className="text-sm font-semibold text-center leading-tight"
        style={{
          color: selected ? color : "var(--text-primary)",
        }}
      >
        {brand}
      </span>
    </button>
  );
}
