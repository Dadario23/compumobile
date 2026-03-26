// src/lib/types.ts

export interface Repuesto {
  nombre: string;
  tipo: TipoReparacion;
  marca: Marca;
  precio: number;
}

export type Marca =
  | "Samsung"
  | "iPhone"
  | "Motorola"
  | "Xiaomi"
  | "Huawei"
  | "Lg"
  | "Nokia"
  | "Otro";

export type TipoReparacion =
  | "Módulo"
  | "Batería"
  | "Placa de Carga"
  | "Flex"
  | "Pin de Carga / Otros";

export interface Presupuesto {
  repuesto: Repuesto;
  precioRepuesto: number;
  manoDeObra: number;
  total: number;
}

export const MANO_DE_OBRA = 22000;

export const MARCAS_ORDEN: Marca[] = [
  "Samsung",
  "iPhone",
  "Motorola",
  "Xiaomi",
  "Huawei",
  "Lg",
  "Nokia",
  "Otro",
];

export const TIPOS_REPARACION: TipoReparacion[] = [
  "Módulo",
  "Batería",
  "Placa de Carga",
  "Flex",
  "Pin de Carga / Otros",
];

export const MARCA_ICONS: Record<Marca, string> = {
  Samsung: "📱",
  iPhone: "🍎",
  Motorola: "〽️",
  Xiaomi: "🔴",
  Huawei: "🌐",
  Lg: "🔲",
  Nokia: "📟",
  Otro: "📲",
};
