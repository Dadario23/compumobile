#!/usr/bin/env python3
"""
scripts/gen_icons.py  –  genera íconos PWA placeholder en PNG.
Reemplazá los PNGs por el logo real antes del deploy.

Uso: python scripts/gen_icons.py
Requiere: pip install Pillow
"""

import os
from pathlib import Path

def gen_icon(size: int, out_path: Path):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        print("Pillow no instalado. Generando SVG placeholder en su lugar.")
        gen_svg_placeholder(size, out_path.with_suffix(".svg"))
        return

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background rounded square (simulated with ellipse + rect)
    margin = size // 8
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 5,
        fill=(99, 102, 241),   # indigo-500
    )

    # Letter "T"
    font_size = int(size * 0.42)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()

    text = "T"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(
        ((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1]),
        text,
        fill=(255, 255, 255),
        font=font,
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG")
    print(f"  ✅  {out_path}  ({size}x{size})")


def gen_svg_placeholder(size: int, out_path: Path):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <rect width="{size}" height="{size}" rx="{size//5}" fill="#6366f1"/>
  <text x="50%" y="54%" font-family="system-ui,sans-serif" font-weight="900"
        font-size="{int(size*0.42)}" fill="white" text-anchor="middle" dominant-baseline="middle">T</text>
</svg>"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(svg)
    print(f"  ✅  SVG placeholder: {out_path}")


if __name__ == "__main__":
    base = Path(__file__).parent.parent / "public" / "icons"
    for s in [192, 512]:
        gen_icon(s, base / f"icon-{s}x{s}.png")
    print("\n⚠️  Reemplazá estos íconos por el logo real antes del deploy.")
