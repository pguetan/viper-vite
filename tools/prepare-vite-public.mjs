import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDist = path.join(root, "dist");
const publicDir = path.join(root, "public");
const mirrorDir = path.join(publicDir, "mirror");
const publicAssetsDir = path.join(publicDir, "assets");

const routeDirs = ["about", "blog", "contact", "work"];
const framerCleanupStyle =
  '<style id="offline-framer-cleanup">#__framer-badge-container,.__framer-badge,a[href*="framer.com/projects/new"]{display:none!important;visibility:hidden!important;pointer-events:none!important}</style>';

async function copyIfExists(from, to) {
  try {
    await fs.cp(from, to, { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function rewriteMirrorHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await rewriteMirrorHtml(fullPath);
      continue;
    }

    if (entry.name.endsWith(".html")) {
      const html = await fs.readFile(fullPath, "utf8");
      let next = html.replace(/(["'])(?:\.\.?\/)+assets\/offline-support\.js\1/g, '"/assets/offline-support.js"');
      if (next.includes("offline-framer-cleanup")) {
        next = next.replace(/<style id="offline-framer-cleanup">[\s\S]*?<\/style>/, framerCleanupStyle);
      } else {
        next = next.replace(
          "</head>",
          `    ${framerCleanupStyle}\n</head>`,
        );
      }
      await fs.writeFile(fullPath, next, "utf8");
    }
  }
}

async function main() {
  await fs.access(path.join(sourceDist, "index.html"));

  await fs.rm(mirrorDir, { recursive: true, force: true });
  await fs.rm(publicAssetsDir, { recursive: true, force: true });
  await fs.mkdir(mirrorDir, { recursive: true });

  await fs.copyFile(path.join(sourceDist, "index.html"), path.join(mirrorDir, "index.html"));
  await copyIfExists(path.join(sourceDist, "offline-manifest.json"), path.join(mirrorDir, "offline-manifest.json"));
  await copyIfExists(path.join(sourceDist, "assets"), publicAssetsDir);

  for (const dir of routeDirs) {
    await copyIfExists(path.join(sourceDist, dir), path.join(mirrorDir, dir));
  }

  await rewriteMirrorHtml(mirrorDir);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
