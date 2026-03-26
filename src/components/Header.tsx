"use client";
// src/components/Header.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",          label: "Presupuesto" },
  { href: "/servicios", label: "Servicios"   },
];

export default function Header() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 card-glass px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline" style={{ textDecoration: "none" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm select-none"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}
        >
          T
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            TZI Reparaciones
          </span>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Av. 12 de Octubre 2972 · Local 3
          </span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {NAV.map(({ href, label }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background:      active ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent",
                color:           active ? "var(--accent)" : "var(--text-muted)",
                textDecoration:  "none",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
