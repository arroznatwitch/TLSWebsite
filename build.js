import { MAINTENANCE } from "./src/config.js";
import { execSync } from "node:child_process";
import { rmSync, mkdirSync, copyFileSync, cpSync } from "node:fs";

const DIST = "dist";

if (MAINTENANCE) {
  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });
  copyFileSync("maintenance.html", `${DIST}/index.html`);
  cpSync("public", DIST, { recursive: true });
} else {
  execSync("parcel build index.html --dist-dir dist --public-url /", { stdio: "inherit" });
}
