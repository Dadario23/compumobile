# TZI Reparaciones — PWA

Presupuestador instantáneo para reparación de celulares. Built with **Next.js 14** (App Router), **Tailwind CSS** y **next-pwa**.

## Stack

- **Next.js 14** con App Router y TypeScript
- **Tailwind CSS** — design system propio con dark/light mode automático
- **next-pwa** — service worker + instalable como app nativa
- **Datos** — JSON estático generado desde el Excel (575 ítems); migrable a Google Sheets

---

## Ejecutar localmente

```bash
# 1. Clonar e instalar
git clone <repo>
cd tzi-pwa
npm install

# 2. (Opcional) regenerar datos desde el Excel actualizado
pip install pandas openpyxl
python scripts/parse_excel.py Lista_de_Precios_TZI_.xlsx

# 3. Arrancar en dev
npm run dev
# → http://localhost:3000
```

> En modo `development` el Service Worker está **desactivado** para no interferir con hot reload.  
> Para probar la PWA completa: `npm run build && npm start`

---

## Estructura del proyecto

```
tzi-pwa/
├── next.config.js            ← PWA (next-pwa) + config Next
├── tailwind.config.ts
├── public/
│   ├── manifest.json         ← PWA manifest
│   └── icons/
│       ├── icon-192x192.png  ← Reemplazar por logo real
│       └── icon-512x512.png
├── scripts/
│   ├── parse_excel.py        ← Convierte Excel → JSON
│   └── gen_icons.py          ← Genera íconos placeholder
└── src/
    ├── app/
    │   ├── layout.tsx         ← Root layout + WhatsApp FAB
    │   ├── globals.css        ← Design system completo
    │   ├── page.tsx           ← Wizard de presupuesto (4 pasos)
    │   ├── servicios/page.tsx ← Servicios a domicilio
    │   └── api/repuestos/
    │       └── route.ts       ← API route Google Sheets (opcional)
    ├── components/
    │   ├── Header.tsx
    │   ├── StepIndicator.tsx
    │   ├── BrandCard.tsx
    │   ├── RepuestoSelector.tsx
    │   └── PresupuestoResult.tsx
    ├── lib/
    │   ├── types.ts
    │   └── data.ts            ← Acceso a datos + helpers de formato
    └── data/
        └── repuestos.json     ← 575 ítems (Samsung, iPhone, Motorola…)
```

---

## Desplegar en Vercel

```bash
# Opción A — CLI
npm i -g vercel
vercel login
vercel          # sigue el wizard → auto-detects Next.js

# Opción B — GitHub
# 1. Push a GitHub
# 2. Ir a vercel.com → "Add New Project" → importar el repo
# 3. Vercel detecta Next.js automáticamente
# 4. Click "Deploy"
```

Cada `git push` a `main` dispara un redeploy automático.

---

## Conectar Google Sheets (paso a paso)

> Esto es **opcional**. Sin esta config, la app lee desde `repuestos.json` (build-time).

### 1. Crear Service Account

```
Google Cloud Console → Nuevo proyecto
→ Habilitar "Google Sheets API"
→ IAM & Admin → Service Accounts → Crear
→ Descargar JSON de credenciales
```

### 2. Compartir el Sheet

```
Google Sheets → Compartir
→ Pegar el email del Service Account (ej: tzi@proyecto.iam.gserviceaccount.com)
→ Rol: Viewer
```

### 3. Estructura del Sheet

| Columna A | Columna B | Columna C | Columna D |
|-----------|-----------|-----------|-----------|
| nombre    | tipo      | marca     | precio    |
| MODULO SAMSUNG A52 | Módulo | Samsung | 25000 |
| BATERIA IPHONE 13  | Batería | iPhone | 21000 |

La hoja debe llamarse **Repuestos** y los datos empezar en la **fila 2**.

### 4. Variables en Vercel

```
GOOGLE_SHEETS_ID          → el ID en la URL del sheet
GOOGLE_SERVICE_ACCOUNT_KEY → todo el JSON como string (en una sola línea)
```

### 5. Activar la API route

En `src/lib/data.ts`, reemplazar el import estático por:

```ts
// En lugar de: import rawData from "@/data/repuestos.json"
const res = await fetch('/api/repuestos', { next: { revalidate: 3600 } })
const REPUESTOS: Repuesto[] = await res.json()
```

---

## Actualizar precios

Cuando recibas un Excel nuevo:

```bash
python scripts/parse_excel.py nuevo_archivo.xlsx
git add src/data/repuestos.json
git commit -m "chore: actualizar precios"
git push  # → Vercel redeploya automáticamente
```

---

## Personalización rápida

| Qué cambiar | Dónde |
|-------------|-------|
| Número de WhatsApp | `src/app/layout.tsx` + `src/components/PresupuestoResult.tsx` |
| Mano de obra fija  | `src/lib/types.ts` → `MANO_DE_OBRA` |
| Dirección          | `src/components/Header.tsx` |
| Colores            | `src/app/globals.css` → `:root { --accent: ... }` |
| Ícono de la app    | `public/icons/icon-192x192.png` + `icon-512x512.png` |

---

## Mejoras futuras

- [ ] Panel admin simple (actualizar precios sin tocar código)
- [ ] Historial de presupuestos (localStorage)
- [ ] Notificaciones push cuando el presupuesto expira
- [ ] Analytics (Vercel Analytics o Plausible)
- [ ] Seguimiento de reparaciones con número de orden
# compumobile
