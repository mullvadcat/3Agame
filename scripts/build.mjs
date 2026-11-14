import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MODULES, TARGET_HTML } from "./manifest.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(rootDir, TARGET_HTML);
const isCheck = process.argv.includes("--check");

const parts = MODULES.map((mod) => {
  const filePath = path.join(rootDir, mod.path);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing source module: ${mod.path}`);
  }
  return fs.readFileSync(filePath, "utf8");
});

const assembled = parts.join("");
const assembledBytes = Buffer.byteLength(assembled, "utf8");
const assembledHash = crypto.createHash("sha256").update(assembled, "utf8").digest("hex");

if (isCheck) {
  const existing = fs.readFileSync(htmlPath, "utf8");
  const existingBytes = Buffer.byteLength(existing, "utf8");
  const existingHash = crypto.createHash("sha256").update(existing, "utf8").digest("hex");

  if (assembledBytes !== existingBytes || assembledHash !== existingHash) {
    console.error(`[verify] MISMATCH!`);
    console.error(`  assembled: ${assembledBytes} bytes, sha256=${assembledHash}`);
    console.error(`  target:    ${existingBytes} bytes, sha256=${existingHash}`);
    process.exit(1);
  }
  console.log(`[verify] OK: ${MODULES.length} modules -> ${TARGET_HTML} (${assembledBytes} bytes, sha256=${assembledHash})`);
} else {
  fs.writeFileSync(htmlPath, assembled, "utf8");
  console.log(`[build] Built ${TARGET_HTML} from ${MODULES.length} modules (${assembledBytes} bytes, sha256=${assembledHash})`);
}
