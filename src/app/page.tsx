"use client";
// src/app/page.tsx

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import StepIndicator from "@/components/StepIndicator";
import BrandCard from "@/components/BrandCard";
import RepuestoSelector from "@/components/RepuestoSelector";
import PresupuestoResult from "@/components/PresupuestoResult";
import { getMarcas, getTiposByMarca } from "@/lib/data";
import type { Marca, TipoReparacion, Repuesto } from "@/lib/types";

const STEPS = [
  { label: "Marca",     icon: "📱" },
  { label: "Falla",     icon: "🔧" },
  { label: "Modelo",    icon: "🔍" },
  { label: "Resultado", icon: "✅" },
];

const TIPO_ICONS: Record<string, string> = {
  "Módulo":               "🖥️",
  "Batería":              "🔋",
  "Placa de Carga":       "⚡",
  "Flex":                 "🔩",
  "Pin de Carga / Otros": "🔌",
};

export default function HomePage() {
  const [step,     setStep]     = useState(0);
  const [marca,    setMarca]    = useState<Marca | null>(null);
  const [tipo,     setTipo]     = useState<TipoReparacion | null>(null);
  const [repuesto, setRepuesto] = useState<Repuesto | null>(null);

  const marcas = getMarcas();

  const handleMarca = (m: Marca) => {
    setMarca(m);
    setTipo(null);
    setRepuesto(null);
    setStep(1);
  };

  const handleTipo = (t: TipoReparacion) => {
    setTipo(t);
    setRepuesto(null);
    setStep(2);
  };

  const handleRepuesto = (r: Repuesto) => {
    setRepuesto(r);
    setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setMarca(null);
    setTipo(null);
    setRepuesto(null);
  };

  const tiposDisponibles = marca ? getTiposByMarca(marca) : [];

  return (
    <main className="min-h-dvh flex flex-col">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-10 px-4 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: "-40%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, color-mix(in srgb, #6366f1 12%, transparent) 0%, transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
              color: "var(--accent)",
            }}
          >
            ⚡ Presupuesto en segundos
          </span>

          <h1
            className="text-3xl sm:text-4xl font-black leading-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            ¿Qué le pasó a{" "}
            <span style={{ color: "var(--accent)" }}>tu celular?</span>
          </h1>

          <p className="text-base max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
            Seleccioná la marca, el tipo de falla y el modelo.
            Te mostramos el precio al instante.
          </p>
        </div>
      </section>

      {/* ── Wizard ───────────────────────────────────────────────────── */}
      <section className="flex-1 px-4 pb-10 max-w-xl w-full mx-auto">
        <StepIndicator steps={STEPS} current={step} />

        <div className="card p-5 shadow-lg" style={{ minHeight: "280px" }}>

          {/* STEP 0 — Marca */}
          {step === 0 && (
            <div className="animate-fade-up">
              <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Seleccioná la marca
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {marcas.map((m) => (
                  <BrandCard
                    key={m}
                    brand={m}
                    selected={marca === m}
                    onClick={() => handleMarca(m)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Tipo de falla */}
          {step === 1 && marca && (
            <div className="animate-fade-up">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1.5 text-xs font-semibold mb-4 rounded-lg px-2 py-1 transition-colors"
                style={{ color: "var(--text-muted)", background: "var(--bg-input)" }}
              >
                ← {marca}
              </button>

              <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                ¿Qué necesitás reparar?
              </h2>

              <div className="flex flex-col gap-2">
                {tiposDisponibles.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTipo(t)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left w-full transition-all duration-100"
                    style={{
                      background: "var(--bg-input)",
                      border: "1.5px solid var(--border)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  >
                    <span className="text-xl" aria-hidden>
                      {TIPO_ICONS[t] ?? "🔧"}
                    </span>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t}
                    </span>
                    <svg
                      className="ml-auto"
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ color: "var(--text-muted)" }}
                      aria-hidden
                    >
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Buscar modelo */}
          {step === 2 && marca && tipo && (
            <div className="animate-fade-up">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold mb-4 rounded-lg px-2 py-1 transition-colors"
                style={{ color: "var(--text-muted)", background: "var(--bg-input)" }}
              >
                ← {tipo}
              </button>

              <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Buscá tu modelo
              </h2>

              <RepuestoSelector
                marca={marca}
                tipo={tipo}
                onSelect={handleRepuesto}
              />
            </div>
          )}

          {/* STEP 3 — Resultado */}
          {step === 3 && repuesto && (
            <div className="animate-fade-up">
              <h2 className="text-base font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Tu presupuesto 🎉
              </h2>
              <PresupuestoResult repuesto={repuesto} onReset={handleReset} />
            </div>
          )}
        </div>
      </section>

      {/* ── Banner Servicios a domicilio ─────────────────────────────── */}
      <section className="px-4 pb-24 max-w-xl w-full mx-auto">
        <Link
          href="/servicios"
          className="card flex items-center gap-4 p-4 group transition-all duration-150"
          style={{
            textDecoration: "none",
            border: "1.5px solid var(--border)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
          }
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
          >
            🏠
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Servicios técnicos a domicilio
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
              PC · Redes · Cámaras de seguridad
            </p>
          </div>
          <svg
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }}
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
