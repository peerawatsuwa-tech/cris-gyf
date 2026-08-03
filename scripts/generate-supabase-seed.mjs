import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = new URL("../src/data/excelFleet.ts", import.meta.url);
const outputUrl = new URL("../supabase/seed.sql", import.meta.url);
const source = await readFile(sourceUrl, "utf8");

const executableSource = source
  .replace(/^import type .*\n/m, "")
  .replace("export const EXCEL_DATASET_ID", "const EXCEL_DATASET_ID")
  .replace("export const fleet: Ship[]", "const fleet")
  .replaceAll("undefined as never", "null")
  .concat("\nreturn { EXCEL_DATASET_ID, fleet };\n");

const { EXCEL_DATASET_ID, fleet } = Function(executableSource)();
const values = fleet.map((ship) => {
  const payload = JSON.stringify(ship).replaceAll("'", "''");
  const id = ship.id.replaceAll("'", "''");
  const hullNumber = ship.hullNumber.replaceAll("'", "''");
  return `('${id}', '${hullNumber}', '${payload}'::jsonb, '${EXCEL_DATASET_ID}')`;
});

const sql = `-- Generated from src/data/excelFleet.ts. Do not edit by hand.\n` +
  `insert into public.ships(id, hull_number, payload, dataset_id)\nvalues\n  ` +
  values.join(",\n  ") +
  `\non conflict (id) do update set\n` +
  `  hull_number = excluded.hull_number,\n` +
  `  payload = excluded.payload,\n` +
  `  dataset_id = excluded.dataset_id,\n` +
  `  updated_at = now();\n`;

await writeFile(outputUrl, sql, "utf8");
console.log(`Generated ${fleet.length} ships in supabase/seed.sql`);
