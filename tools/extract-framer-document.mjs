import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const pages = {
  home: {
    input: path.join(root, "dist", "index.html"),
    output: path.join(root, "src", "generated", "homeFramerDocument.js"),
    exportName: "homeFramerDocument",
  },
  contact: {
    input: path.join(root, "dist", "contact", "index.html"),
    output: path.join(root, "src", "generated", "contactFramerDocument.js"),
    exportName: "contactFramerDocument",
  },
  mysticMeadows: {
    input: path.join(root, "dist", "work", "mystic-meadows", "index.html"),
    output: path.join(root, "src", "generated", "mysticMeadowsFramerDocument.js"),
    exportName: "mysticMeadowsFramerDocument",
  },
};

function normalizeHtml(html) {
  return html.replace(/(["'])(?:\.\.?\/)+assets\/offline-support\.js\1/g, '"/assets/offline-support.js"');
}

function extractDocumentParts(html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const headHtml = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const bodyHtml = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const bodyScripts = [...bodyHtml.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map((match) => match[0]);
  const bodyWithoutScripts = bodyHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  return {
    title: title.replace(/&amp;/g, "&"),
    headHtml: normalizeHtml(headHtml),
    bodyHtml: normalizeHtml(bodyWithoutScripts),
    scriptHtml: normalizeHtml(bodyScripts.join("\n")),
  };
}

async function writeDocument(page) {
  const html = await fs.readFile(page.input, "utf8");
  const documentParts = extractDocumentParts(html);
  const source = `export const ${page.exportName} = ${JSON.stringify(documentParts, null, 2)};\n`;

  await fs.mkdir(path.dirname(page.output), { recursive: true });
  await fs.writeFile(page.output, source, "utf8");
}

async function main() {
  const pageName = process.argv[2] ?? "contact";
  const page = pages[pageName];

  if (!page) {
    throw new Error(`Unknown page "${pageName}". Expected one of: ${Object.keys(pages).join(", ")}`);
  }

  await writeDocument(page);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
