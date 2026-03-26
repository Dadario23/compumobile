#!/usr/bin/env python3
"""
scripts/parse_excel.py
─────────────────────
Convierte Lista_de_Precios_TZI_.xlsx → src/data/repuestos.json

Uso:
  pip install pandas openpyxl
  python scripts/parse_excel.py                     # usa el archivo en la raíz
  python scripts/parse_excel.py ruta/al/archivo.xlsx

El JSON resultante tiene la estructura:
  [{ "nombre": "...", "tipo": "...", "marca": "...", "precio": 12345 }, ...]
"""

import sys
import json
import pandas as pd
from pathlib import Path

SHEET_MAP = {
    "MODULOS":             "Módulo",
    "BATERIAS":            "Batería",
    "PLACAS DE CARGA":     "Placa de Carga",
    "FLEX MAIN  FLEX POWER": "Flex",
    "PIN DE CARGA  OTROS": "Pin de Carga / Otros",
}

BRAND_MAP = {
    "IPHONE":   "iPhone",
    "APPLE":    "iPhone",
    "MOTO":     "Motorola",
    "MOTOROLA": "Motorola",
    "REDMI":    "Xiaomi",
    "XIAOMI":   "Xiaomi",
    "SAMSUNG":  "Samsung",
    "HUAWEI":   "Huawei",
    "NOKIA":    "Nokia",
    "LG":       "Lg",
}

# Columna índices (0-based)
COL_NAME   = 2
PRICE_COLS = [7, 8, 9, 5]   # en orden de preferencia
DATA_START = 14              # primera fila de datos reales (0-based)


def detect_brand(name: str) -> str:
    upper = name.upper()
    for key, brand in BRAND_MAP.items():
        if key in upper:
            return brand
    return "Otro"


def extract_price(row: pd.Series) -> float | None:
    for col in PRICE_COLS:
        if col >= len(row):
            continue
        val = row.iloc[col]
        if pd.notna(val) and isinstance(val, (int, float)) and float(val) > 1000:
            return float(val)
    return None


def parse(xlsx_path: Path) -> list[dict]:
    items = []
    for sheet, tipo in SHEET_MAP.items():
        try:
            df = pd.read_excel(xlsx_path, sheet_name=sheet, header=None)
        except Exception as e:
            print(f"  ⚠️  No se pudo leer '{sheet}': {e}")
            continue

        for idx in range(DATA_START, len(df)):
            row  = df.iloc[idx]
            name = row.iloc[COL_NAME] if COL_NAME < len(row) else None

            if not name or not isinstance(name, str):
                continue

            name = name.strip()
            if not name:
                continue

            # Descartar filas que son encabezados de sección
            if name.isupper() and len(name.split()) <= 5 and all(
                not str(row.iloc[c]).lstrip("-").replace(".", "").isdigit()
                for c in PRICE_COLS
                if c < len(row) and pd.notna(row.iloc[c])
            ):
                pass  # puede ser encabezado, pero igual lo procesamos si tiene precio

            price = extract_price(row)
            if price is None:
                continue

            items.append(
                {
                    "nombre": name,
                    "tipo":   tipo,
                    "marca":  detect_brand(name),
                    "precio": int(round(price)),
                }
            )

    return items


def main():
    xlsx_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("Lista_de_Precios_TZI_.xlsx")

    if not xlsx_path.exists():
        print(f"❌  No se encontró el archivo: {xlsx_path}")
        sys.exit(1)

    print(f"📂  Leyendo: {xlsx_path}")
    items = parse(xlsx_path)
    print(f"✅  {len(items)} ítems parseados")

    out = Path("src/data/repuestos.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"💾  Guardado en: {out}")

    # Resumen por marca / tipo
    from collections import Counter
    brands = Counter(i["marca"] for i in items)
    types  = Counter(i["tipo"]  for i in items)
    print("\n── Por marca ──────────────────")
    for b, n in brands.most_common():
        print(f"  {b:20s} {n:>4}")
    print("\n── Por tipo ───────────────────")
    for t, n in types.most_common():
        print(f"  {t:30s} {n:>4}")


if __name__ == "__main__":
    main()
