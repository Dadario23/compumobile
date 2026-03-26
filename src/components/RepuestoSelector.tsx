"use client";
// src/components/RepuestoSelector.tsx

import { useState, useMemo, useRef, useEffect } from "react";
import { getRepuestos, searchRepuestos, formatARS } from "@/lib/data";
import type { Marca, TipoReparacion, Repuesto } from "@/lib/types";

interface Props {
  marca: Marca;
  tipo:  TipoReparacion;
  onSelect: (r: Repuesto) => void;
}

export default function RepuestoSelector({ marca, tipo, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // small delay so the fade-up animation completes before autofocus
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const items: Repuesto[] = useMemo(() => {
    if (query.trim().length >= 2) return searchRepuestos(query);
    return getRepuestos(marca, tipo);
  }, [query, marca, tipo]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          width="17" height="17" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2"
          style={{ color: "var(--text-muted)" }}
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          className="input-base pl-10 pr-4"
          placeholder="Escribí el modelo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar modelo"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "var(--border)", color: "var(--text-muted)" }}
            aria-label="Limpiar búsqueda"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Count hint */}
      <p className="text-xs px-1" style={{ color: "var(--text-muted)" }}>
        {items.length === 0
          ? "Sin resultados"
          : query.trim().length >= 2
          ? `${items.length} resultado${items.length !== 1 ? "s" : ""}`
          : `${items.length} modelos disponibles · desplazá para ver más`}
      </p>

      {/* List */}
      <div
        className="flex flex-col gap-1.5 overflow-y-auto pr-0.5"
        style={{ maxHeight: "17rem" }}
        role="listbox"
        aria-label="Lista de modelos"
      >
        {items.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <span className="text-3xl">🔍</span>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No encontramos ese modelo.<br />
              Consultanos por WhatsApp.
            </p>
            <a
              href="https://wa.me/541150610043?text=Hola%2C%20no%20encontr%C3%A9%20mi%20modelo%20en%20la%20app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Consultar por WhatsApp
            </a>
          </div>
        ) : (
          items.map((r, i) => (
            <button
              key={`${r.nombre}-${i}`}
              role="option"
              aria-selected={false}
              onClick={() => onSelect(r)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-left w-full transition-all duration-100 group"
              style={{
                background: "var(--bg-input)",
                border: "1.5px solid transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className="text-sm font-medium leading-snug truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.nombre}
                </span>
                {query.trim().length >= 2 && (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {r.marca} · {r.tipo}
                  </span>
                )}
              </div>
              <span
                className="text-sm font-bold ml-4 shrink-0"
                style={{ color: "var(--accent)" }}
              >
                {formatARS(r.precio)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
