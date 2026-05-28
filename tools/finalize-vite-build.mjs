import fs from "node:fs/promises";
import path from "node:path";
import { siteRoutes } from "../src/data/siteRoutes.js";

const root = process.cwd();
const outDir = path.join(root, "react-dist");
const appIndex = path.join(outDir, "index.html");

async function main() {
  const html = await fs.readFile(appIndex, "utf8");

  for (const route of siteRoutes) {
    if (route.path === "/") continue;
    const routeFile = path.join(outDir, route.path.slice(1), "index.html");
    await fs.mkdir(path.dirname(routeFile), { recursive: true });
    await fs.writeFile(routeFile, html, "utf8");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
