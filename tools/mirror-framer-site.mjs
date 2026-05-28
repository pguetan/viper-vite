import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const ORIGIN = "https://viper-template.framer.website";
const OUT_DIR = path.resolve("dist");
const ASSET_DIR = path.join(OUT_DIR, "assets");
const ROUTES = new Set(["/"]);
const seenRoutes = new Set();
const assetMap = new Map();
const fetchedAssets = new Set();

const allowedAssetHosts = new Set([
  "framerusercontent.com",
  "events.framer.com",
  "cdn.unicorn.studio",
  "www.framer.com",
  "framer.com",
]);

const textAssetExtensions = new Set([
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".svg",
  ".html",
  ".txt",
  ".xml",
]);

function normalizeRoute(route) {
  const url = new URL(route, ORIGIN);
  if (url.origin !== ORIGIN) return null;
  let pathname = url.pathname.replace(/\/+$/, "");
  if (pathname === "") pathname = "/";
  return pathname;
}

function routeOutputPath(route) {
  if (route === "/") return path.join(OUT_DIR, "index.html");
  return path.join(OUT_DIR, route.slice(1), "index.html");
}

function relativeToFile(fromFile, targetFile) {
  let rel = path.relative(path.dirname(fromFile), targetFile).replaceAll(path.sep, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

function rootRelativeAssetPath(url) {
  return `/${path.relative(OUT_DIR, assetPathFor(url)).replaceAll(path.sep, "/")}`;
}

function safeAssetName(url) {
  const u = new URL(url);
  const baseName = path.basename(u.pathname) || "index";
  const ext = path.extname(baseName);
  const stem = ext ? baseName.slice(0, -ext.length) : baseName;
  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);
  const cleanStem = stem.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "asset";
  const cleanExt = (ext || ".bin").replace(/[^a-zA-Z0-9.]/g, "");
  return `${u.hostname}/${cleanStem}.${hash}${cleanExt}`;
}

function assetPathFor(url) {
  if (!assetMap.has(url)) {
    assetMap.set(url, path.join(ASSET_DIR, safeAssetName(url)));
  }
  return assetMap.get(url);
}

function aliasPathFor(url) {
  const u = new URL(url);
  if (u.search) return null;
  const baseName = path.basename(u.pathname);
  if (!baseName) return null;
  return path.join(ASSET_DIR, u.hostname, baseName.replace(/[^a-zA-Z0-9._-]/g, "_"));
}

function isTextAsset(url, contentType = "") {
  if (/text|javascript|json|xml|svg/i.test(contentType)) return true;
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  return textAssetExtensions.has(ext);
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType: res.headers.get("content-type") || "" };
}

function collectUrls(text, baseUrl) {
  const urls = new Set();
  const patterns = [
    /(?:src|href|poster|content)=["']([^"']+)["']/gi,
    /srcset=["']([^"']+)["']/gi,
    /url\((?!['"]?#)(['"]?)([^'")]+)\1\)/gi,
    /import\s*(?:\([^)]*?["']([^"']+)["']\)|[^"']*?from\s*["']([^"']+)["'])/gi,
    /import\(\s*`([^`]+)`\s*\)/gi,
    /(?:import|export)\s+[^"']*?from\s*["']([^"']+)["']/gi,
    /https?:\/\/[^\s"'<>\\)`},]+/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const raw = match[1] || match[2] || match[0];
      if (!raw || raw.startsWith("data:") || raw.startsWith("mailto:") || raw.startsWith("#")) continue;
      if (raw.includes(",")) {
        for (const part of raw.split(",")) {
          const candidate = part.trim().split(/\s+/)[0];
          try {
            urls.add(new URL(candidate, baseUrl).href);
          } catch {}
        }
      } else {
        try {
          urls.add(new URL(raw.replaceAll("&amp;", "&"), baseUrl).href);
        } catch {}
      }
    }
  }

  for (const match of text.matchAll(/new URL\(\s*`([^`]+)`\s*,\s*`([^`]+)`\s*\)/gi)) {
    const asset = match[1];
    const assetBase = match[2];
    if (!asset || asset.includes("${")) continue;

    try {
      urls.add(new URL(asset, new URL(assetBase, baseUrl)).href);
    } catch {}
  }

  return [...urls];
}

function normalizeLocalUrlConstructors(text) {
  return text.replace(
    /new URL\(`([^`]+)`,`(?:\.\/|\/assets\/)[^`]+`\)/g,
    "new URL(`$1`, import.meta.url)",
  );
}

function collectRoutesFromHtml(html, baseUrl) {
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    const route = normalizeRoute(new URL(href, baseUrl).href);
    if (route) ROUTES.add(route);
  }
}

function rewriteInternalLinks(text, outputFile, baseUrl) {
  return text.replace(/\b(href|content)=["']([^"']+)["']/gi, (full, attr, rawValue) => {
    const value = rawValue.replaceAll("&amp;", "&");
    if (value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:")) return full;
    if (!/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(value)) return full;

    let url;
    try {
      url = new URL(value, baseUrl);
    } catch {
      return full;
    }

    if (url.origin !== ORIGIN) return full;
    const route = normalizeRoute(url.href);
    if (!route || !ROUTES.has(route)) return full;
    const hash = url.hash || "";
    return `${attr}="${relativeToFile(outputFile, routeOutputPath(route))}${hash}"`;
  });
}

function injectOfflineSupport(html, outputFile) {
  const supportPath = relativeToFile(outputFile, path.join(ASSET_DIR, "offline-support.js"));
  const badgeStyle =
    "    <style id=\"offline-framer-cleanup\">#__framer-badge-container,.__framer-badge,a[href*=\"framer.com/projects/new\"]{display:none!important;visibility:hidden!important;pointer-events:none!important}</style>\n";
  let next = html.includes("offline-framer-cleanup")
    ? html.replace(/<style id="offline-framer-cleanup">[\s\S]*?<\/style>/, badgeStyle.trim())
    : html.replace("</head>", badgeStyle + "</head>");
  if (next.includes("offline-support.js")) return next;
  return next.replace("</head>", `    <script src="${supportPath}"></script>\n</head>`);
}

function rewriteAssetUrls(text, outputFile, baseUrl) {
  let rewritten = text;
  const urls = collectUrls(text, baseUrl)
    .filter((url) => {
      const u = new URL(url);
      return allowedAssetHosts.has(u.hostname) && u.hostname !== "www.framer.com" && u.hostname !== "framer.com";
    })
    .sort((a, b) => b.length - a.length);

  for (const url of urls) {
    const localPath = rootRelativeAssetPath(url);
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rewritten = rewritten.replace(new RegExp(escaped, "g"), localPath);
    rewritten = rewritten.replace(new RegExp(escaped.replaceAll("&", "&amp;"), "g"), localPath);
  }

  rewritten = rewritten.replace(/<script[^>]+src=["'][^"']*events\.framer\.com\/script[^"']*["'][^>]*><\/script>/gi, "");
  return rewriteInternalLinks(rewritten, outputFile, baseUrl);
}

async function fetchAsset(url) {
  if (fetchedAssets.has(url)) return;
  fetchedAssets.add(url);

  const outputFile = assetPathFor(url);
  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  try {
    const { buffer, contentType } = await fetchBuffer(url);
    let written;
    if (isTextAsset(url, contentType)) {
      const source = buffer.toString("utf8");
      for (const nested of collectUrls(source, url)) {
        const u = new URL(nested);
        if (allowedAssetHosts.has(u.hostname) && u.hostname !== "www.framer.com" && u.hostname !== "framer.com") {
          assetPathFor(nested);
        }
      }
      const rewritten = normalizeLocalUrlConstructors(rewriteAssetUrls(source, outputFile, url));
      await fs.writeFile(outputFile, rewritten, "utf8");
      written = Buffer.from(rewritten, "utf8");
    } else {
      await fs.writeFile(outputFile, buffer);
      written = buffer;
    }

    const aliasFile = aliasPathFor(url);
    if (aliasFile && path.resolve(aliasFile) !== path.resolve(outputFile)) {
      await fs.mkdir(path.dirname(aliasFile), { recursive: true });
      await fs.writeFile(aliasFile, written);
    }
    console.log(`asset ${url}`);
  } catch (error) {
    console.warn(`asset failed ${url}: ${error.message}`);
  }
}

async function fetchRoute(route) {
  if (seenRoutes.has(route)) return;
  seenRoutes.add(route);

  const url = new URL(route, ORIGIN).href;
  const outputFile = routeOutputPath(route);
  await fs.mkdir(path.dirname(outputFile), { recursive: true });

  const { buffer } = await fetchBuffer(url);
  const html = buffer.toString("utf8");
  collectRoutesFromHtml(html, url);

  for (const assetUrl of collectUrls(html, url)) {
    const u = new URL(assetUrl);
    if (allowedAssetHosts.has(u.hostname) && u.hostname !== "www.framer.com" && u.hostname !== "framer.com") {
      assetPathFor(assetUrl);
    }
  }

  const rewritten = injectOfflineSupport(rewriteAssetUrls(html, outputFile, url), outputFile);
  await fs.writeFile(outputFile, rewritten, "utf8");
  console.log(`route ${route}`);
}

async function main() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (let index = 0; index < [...ROUTES].length; index++) {
    const route = [...ROUTES][index];
    await fetchRoute(route);
  }

  let previousCount = -1;
  while (previousCount !== assetMap.size) {
    previousCount = assetMap.size;
    for (const url of [...assetMap.keys()]) {
      await fetchAsset(url);
    }
  }

  await fs.writeFile(
    path.join(ASSET_DIR, "offline-support.js"),
    `(() => {
  const originalFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input && input.url;
    if (url && /https:\\/\\/api\\.framer\\.com\\/forms\\//.test(url)) {
      return new Response(JSON.stringify({ ok: true, offline: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return originalFetch ? originalFetch(input, init) : Promise.reject(new Error("fetch is unavailable"));
  };
})();\n`,
    "utf8",
  );

  const report = {
    origin: ORIGIN,
    routes: [...seenRoutes].sort(),
    assets: fetchedAssets.size,
    generatedAt: new Date().toISOString(),
  };
  await fs.writeFile(path.join(OUT_DIR, "offline-manifest.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
