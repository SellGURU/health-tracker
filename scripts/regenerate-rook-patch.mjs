import { execSync } from "child_process";
import { createRequire } from "module";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "rook-patch-"));
process.chdir(tmp);

execSync("npm pack capacitor-rook-sdk@0.5.1", { stdio: "pipe" });
execSync("tar -xf capacitor-rook-sdk-0.5.1.tgz");

const clean = path.join(
  tmp,
  "package/android/src/main/java/io/tryrook/rook/sdk/RookImplementation.kt",
);
const patched = path.join(
  root,
  "node_modules/capacitor-rook-sdk/android/src/main/java/io/tryrook/rook/sdk/RookImplementation.kt",
);

let diff = "";
try {
  diff = execSync(`git diff --no-index -- "${clean}" "${patched}"`, {
    encoding: "utf8",
  });
} catch (error) {
  if (error.stdout) {
    diff = error.stdout.toString();
  } else {
    throw error;
  }
}

const targetPath =
  "node_modules/capacitor-rook-sdk/android/src/main/java/io/tryrook/rook/sdk/RookImplementation.kt";

const hunkStart = diff.indexOf("@@");
if (hunkStart === -1) {
  throw new Error("No patch hunks found");
}

const indexMatch = diff.match(/index ([0-9a-f]+)\.\.([0-9a-f]+)/);
const beforeHash = indexMatch?.[1] ?? "efa7284";
const afterHash = indexMatch?.[2] ?? "f50ed30";
const hunks = `${diff.slice(hunkStart).trimEnd()}\n \n`;

const patch = [
  `diff --git a/${targetPath} b/${targetPath}`,
  `index ${beforeHash}..${afterHash} 100644`,
  `--- a/${targetPath}`,
  `+++ b/${targetPath}`,
  hunks,
].join("\n");

const out = path.join(root, "patches/capacitor-rook-sdk+0.5.1.patch");
fs.writeFileSync(out, patch);

const { parsePatchFile } = require(
  path.join(root, "node_modules/patch-package/dist/patch/parse.js"),
);
parsePatchFile(fs.readFileSync(out, "utf8"));

console.log(`Wrote ${out} (${fs.statSync(out).size} bytes)`);
console.log("Patch parse OK");
