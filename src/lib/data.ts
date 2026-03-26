// src/lib/data.ts
// Data access layer. In production, this can be swapped with a Google Sheets
// or Supabase fetch without touching any UI code.

import type { Repuesto, Marca, TipoReparacion } from "./types";

// Import at build-time for zero-latency local reads.
// To switch to Google Sheets, replace this import with a fetch() call in the
// API route /api/repuestos and expose the same shape.
import rawData from "@/data/repuestos.json";

const REPUESTOS: Repuesto[] = rawData as Repuesto[];

/** Returns the full catalog (memoized by module scope). */
export function getAll(): Repuesto[] {
  return REPUESTOS;
}

/** Distinct brands present in the catalog. */
export function getMarcas(): Marca[] {
  const set = new Set<Marca>(REPUESTOS.map((r) => r.marca));
  const order: Marca[] = [
    "Samsung",
    "iPhone",
    "Motorola",
    "Xiaomi",
    "Huawei",
    "Lg",
    "Nokia",
    "Otro",
  ];
  return order.filter((m) => set.has(m));
}

/** Distinct repair types available for a given brand. */
export function getTiposByMarca(marca: Marca): TipoReparacion[] {
  const set = new Set<TipoReparacion>(
    REPUESTOS.filter((r) => r.marca === marca).map((r) => r.tipo)
  );
  const order: TipoReparacion[] = [
    "Módulo",
    "Batería",
    "Placa de Carga",
    "Flex",
    "Pin de Carga / Otros",
  ];
  return order.filter((t) => set.has(t));
}

/** All items for a brand + repair type, sorted by name. */
export function getRepuestos(
  marca: Marca,
  tipo: TipoReparacion
): Repuesto[] {
  return REPUESTOS.filter((r) => r.marca === marca && r.tipo === tipo).sort(
    (a, b) => a.nombre.localeCompare(b.nombre)
  );
}

/** Fuzzy search across all items (used in the search bar). */
export function searchRepuestos(query: string): Repuesto[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return REPUESTOS.filter(
    (r) =>
      r.nombre.toLowerCase().includes(q) ||
      r.marca.toLowerCase().includes(q) ||
      r.tipo.toLowerCase().includes(q)
  )
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .slice(0, 20);
}

/** Format a price as ARS currency string. */
export function formatARS(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
