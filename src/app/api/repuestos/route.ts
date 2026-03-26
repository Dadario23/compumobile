// src/app/api/repuestos/route.ts
//
// Ruta OPCIONAL para leer precios desde Google Sheets en tiempo real.
// Sin configuración, devuelve 501. La app usa src/data/repuestos.json por defecto.
//
// Setup: ver README.md → "Conectar Google Sheets"

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const rawKey  = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!sheetId || !rawKey) {
    return NextResponse.json(
      { error: "Configurá GOOGLE_SHEETS_ID y GOOGLE_SERVICE_ACCOUNT_KEY en Vercel." },
      { status: 501 }
    );
  }

  try {
    // Importación dinámica para no romper el build si 'googleapis' no está instalado
    // Para activar: npm install googleapis
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const googleapis = require("googleapis") as {
      google: {
        auth: { GoogleAuth: new (opts: unknown) => unknown };
        sheets: (opts: unknown) => {
          spreadsheets: {
            values: {
              get: (opts: unknown) => Promise<{ data: { values?: string[][] } }>;
            };
          };
        };
      };
    };
    const { google } = googleapis;

    const credentials = JSON.parse(rawKey);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Repuestos!A2:D",
    });

    const rows  = res.data.values ?? [];
    const items = rows
      .filter((r) => r[0] && r[3] && !isNaN(Number(r[3])))
      .map((r) => ({
        nombre: String(r[0]).trim(),
        tipo:   String(r[1] ?? "").trim(),
        marca:  String(r[2] ?? "Otro").trim(),
        precio: Math.round(Number(r[3])),
      }));

    return NextResponse.json(items, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/repuestos]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
