#!/usr/bin/env node
// Stages eudiplo.dev in dist/: the landing page from this repository plus the
// CLI installer, the published configuration schemas and the security contacts
// from an EUDIPLO checkout. EUDIPLO_DIR points at that checkout (default:
// ./eudiplo); EUDIPLO_INSTALLER_DIR, if set, is the checkout the installer and
// SECURITY.md come from. The deploy workflow takes the schemas from the
// dispatched EUDIPLO commit or the head of main, and for production the
// installer from the latest EUDIPLO release. The schema id and $ref checks repeat
// scripts/check-schema-ids.mjs in EUDIPLO; change both together.
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
const website = resolve(import.meta.dirname, "..");
const eudiplo = resolve(website, process.env.EUDIPLO_DIR ?? "eudiplo");
const installerSource = resolve(
  website,
  process.env.EUDIPLO_INSTALLER_DIR ?? eudiplo,
);
const output = resolve(website, "dist");
if (!existsSync(resolve(eudiplo, "schemas")))
  throw new Error(
    `No EUDIPLO checkout at ${eudiplo}: clone EUDIPLO/eudiplo there or set EUDIPLO_DIR`,
  );
// Releases up to 9.x keep the installer under apps/website, later ones under
// apps/cli.
const installer = ["apps/cli/install.sh", "apps/website/install.sh"]
  .map((path) => resolve(installerSource, path))
  .find((path) => existsSync(path));
if (!installer)
  throw new Error(`Missing CLI installer in the EUDIPLO checkout: ${installerSource}`);
const schemas = new Map();
for (const version of readdirSync(resolve(eudiplo, "schemas"))
  .filter((name) => /^v[1-9][0-9]*$/.test(name))
  .sort()) {
  for (const file of readdirSync(resolve(eudiplo, "schemas", version))
    .filter((name) => name.endsWith(".schema.json"))
    .sort()) {
    const path = `${version}/${file}`;
    const schema = JSON.parse(
      readFileSync(resolve(eudiplo, "schemas", path), "utf8"),
    );
    if (schema.$id !== `https://eudiplo.dev/schemas/${path}`)
      throw new Error(`Noncanonical schema $id: ${path}`);
    schemas.set(schema.$id, { path, schema });
  }
}
if (!schemas.size) throw new Error("No published schema snapshots");
function checkRefs(value, base) {
  if (!value || typeof value !== "object") return;
  if (typeof value.$ref === "string" && !value.$ref.startsWith("#")) {
    const url = new URL(value.$ref, base);
    url.hash = "";
    if (!schemas.has(url.href))
      throw new Error(`Unbundled schema reference: ${url.href}`);
  }
  Object.values(value).forEach((item) => checkRefs(item, base));
}
for (const [url, { schema }] of schemas) checkRefs(schema, url);
// Stage only deployable assets; repository/package files are never published.
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
for (const file of [
  "index.html",
  "logo.svg",
  "eudiplo.png",
  "favicon-32.png",
  "icon-192.png",
  "apple-touch-icon.png",
  "fonts",
  "img",
  "_headers",
  "_redirects",
  "404.html",
]) {
  if (!existsSync(resolve(website, file)))
    throw new Error(`Missing website asset: ${file}`);
  cpSync(resolve(website, file), resolve(output, file), { recursive: true });
}
cpSync(installer, resolve(output, "install.sh"));
// RFC 9116 security.txt: Expires is set at build time, less than a year ahead,
// so every deploy republishes a current file. docs.eudiplo.dev redirects here.
const securityTxt = readFileSync(resolve(website, "security.txt"), "utf8");
if (!/^contact:/im.test(securityTxt) || /^expires:/im.test(securityTxt))
  throw new Error("security.txt needs a Contact and no fixed Expires field");
const securityPolicy = readFileSync(resolve(installerSource, "SECURITY.md"), "utf8");
for (const [, contact] of securityTxt.matchAll(/^contact:\s*(\S+)/gim))
  if (!securityPolicy.includes(contact))
    throw new Error(`security.txt Contact not in SECURITY.md: ${contact}`);
const expires = new Date();
expires.setUTCHours(0, 0, 0, 0);
expires.setUTCDate(expires.getUTCDate() + 360);
mkdirSync(resolve(output, ".well-known"));
writeFileSync(
  resolve(output, ".well-known/security.txt"),
  `${securityTxt.trimEnd()}\nExpires: ${expires.toISOString()}\n`,
);
for (const { path } of schemas.values()) {
  const target = resolve(output, "schemas", path);
  mkdirSync(resolve(target, ".."), { recursive: true });
  cpSync(resolve(eudiplo, "schemas", path), target);
}
const catalog = [...schemas]
  .filter(([, { schema }]) => schema.properties?.$schema)
  .map(([url, { schema }]) => ({ name: schema.title, url }));
writeFileSync(
  resolve(output, "schemas/index.json"),
  `${JSON.stringify({ schemas: catalog }, null, 2)}\n`,
);
console.log(
  `Website staged in dist with ${schemas.size} schema files (${catalog.length} config formats) from ${eudiplo}.`,
);
