import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MODULES, TARGET_HTML } from "./manifest.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(rootDir, TARGET_HTML);
const html = fs.readFileSync(htmlPath, "utf8");

let searchFrom = 0;
const offsets = MODULES.map((mod, idx) => {
  if (mod.marker === null) {
    return 0;
  }
  const offset = html.indexOf(mod.marker, searchFrom);
  if (offset < 0) {
    throw new Error(`Marker not found for module #${idx + 1} (${mod.path}): ${JSON.stringify(mod.marker)}`);
  }
  if (idx > 0 && offset <= searchFrom) {
    throw new Error(`Invalid offset (${offset} <= ${searchFrom}) for module #${idx + 1} (${mod.path})`);
  }
  searchFrom = offset + mod.marker.length;
  return offset;
});

for (let i = 0; i < MODULES.length; i++) {
  const mod = MODULES[i];
  const start = offsets[i];
  const end = i + 1 < MODULES.length ? offsets[i + 1] : html.length;
  const chunk = html.slice(start, end);
  const outPath = path.join(rootDir, mod.path);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, chunk, "utf8");
  console.log(`[split] ${String(i + 1).padStart(2, "0")}/${MODULES.length} ${mod.path} (${Buffer.byteLength(chunk, "utf8")} bytes)`);
}

console.log(`[split] Done: ${MODULES.length} modules written from ${TARGET_HTML} (${Buffer.byteLength(html, "utf8")} bytes).`);
