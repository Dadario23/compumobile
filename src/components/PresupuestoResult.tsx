"use client";
// src/components/PresupuestoResult.tsx

import { MANO_DE_OBRA } from "@/lib/types";
import { formatARS } from "@/lib/data";
import type { Repuesto } from "@/lib/types";

interface Props {
  repuesto: Repuesto;
  onReset:  () => void;
}

const TIPO_ICONS: Record<string, string> = {
  "Módulo":               "🖥️",
  "Batería":              "🔋",
  "Placa de Carga":       "⚡",
  "Flex":                 "🔩",
  "Pin de Carga / Otros": "🔌",
};

export default function PresupuestoResult({ repuesto, onReset }: Props) {
  const total = repuesto.precio + MANO_DE_OBRA;

  const waText = encodeURIComponent(
    `Hola! Quiero confirmar un presupuesto:\n` +
    `• Repuesto: ${repuesto.nombre}\n` +
    `• Tipo: ${repuesto.tipo}\n` +
    `• Presupuesto estimado: ${formatARS(total)}\n\n` +
    `¿Está disponible el repuesto?`
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Success badge */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
          background: "color-mix(in srgb, var(--success) 12%, transparent)",
          border: "1.5px solid color-mix(in srgb, var(--success) 30%, transparent)",
        }}
      >
        <span className="text-xl" aria-hidden>✅</span>
        <p className="text-sm font-semibold" style={{ color: "var(--success)" }}>
          Presupuesto calculado correctamente
        </p>
      </div>

      {/* Repuesto info */}
      <div className="card p-4 flex items-start gap-3">
        <span className="text-2xl mt-0.5" aria-hidden>
          {TIPO_ICONS[repuesto.tipo] ?? "📱"}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: "var(--text-muted)" }}>
            Repuesto seleccionado
          </p>
          <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
            {repuesto.nombre}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {repuesto.marca} &middot; {repuesto.tipo}
          </p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="card p-4 flex flex-col gap-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "var(--text-muted)" }}>
          Desglose del presupuesto
        </p>

        {/* Repuesto row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} aria-hidden />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Repuesto
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {formatARS(repuesto.precio)}
          </span>
        </div>

        {/* Mano de obra row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent-light)" }} aria-hidden />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Mano de obra
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {formatARS(MANO_DE_OBRA)}
          </span>
        </div>

        {/* Divider */}
        <div
          className="h-px my-1"
          style={{ background: "repeating-linear-gradient(90deg, var(--border) 0, var(--border) 6px, transparent 6px, transparent 12px)" }}
          aria-hidden
        />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
            Total estimado
          </span>
          <span
            className="font-black text-2xl tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {formatARS(total)}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <p
        className="text-xs text-center px-3 py-2 rounded-lg"
        style={{
          color: "var(--warning)",
          background: "color-mix(in srgb, var(--warning) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--warning) 25%, transparent)",
        }}
      >
        ⚠️ Precio estimado sujeto a verificación técnica
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-2 pt-1">
        <a
          href={`https://wa.me/541150610043?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full"
          style={{
            background:  "#25D366",
            boxShadow:   "0 4px 14px rgba(37,211,102,0.35)",
          }}
        >
          {/* WhatsApp icon */}
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Confirmar por WhatsApp
        </a>

        <button onClick={onReset} className="btn-ghost w-full">
          ← Hacer otro presupuesto
        </button>
      </div>
    </div>
  );
}
