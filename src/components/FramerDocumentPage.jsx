import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { siteRoutes } from "../data/siteRoutes.js";

function createNodesFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return Array.from(template.content.childNodes);
}

function cloneScript(script) {
  const next = document.createElement("script");

  for (const attribute of script.attributes) {
    next.setAttribute(attribute.name, attribute.value);
  }

  next.textContent = script.textContent;
  return next;
}

function routeForUrl(url) {
  const normalizedPath = url.pathname
    .replace(/\/index\.html$/, "")
    .replace(/\/$/, "");
  const pathname = normalizedPath || "/";

  return siteRoutes.find((route) => route.path === pathname);
}

export function FramerDocumentPage({ document }) {
  const injectedNodes = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = window.document.title;
    window.document.title = document.title;

    const headNodes = createNodesFromHtml(document.headHtml);
    const scriptNodes = createNodesFromHtml(document.scriptHtml);
    const injected = [];

    for (const node of [...headNodes, ...scriptNodes]) {
      const next = node.nodeName === "SCRIPT" ? cloneScript(node) : node.cloneNode(true);
      if (next.nodeType === Node.ELEMENT_NODE) {
        next.setAttribute("data-native-framer-page", document.title);
      }

      const parent = next.nodeName === "SCRIPT" ? window.document.body : window.document.head;
      parent.appendChild(next);
      injected.push(next);
    }

    injectedNodes.current = injected;

    return () => {
      window.document.title = previousTitle;
      for (const node of injectedNodes.current) {
        node.remove();
      }
      injectedNodes.current = [];
    };
  }, [document]);

  const handleClickCapture = useCallback(
    (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link || link.target === "_blank" || event.defaultPrevented) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const route = routeForUrl(url);
      if (!route) return;

      event.preventDefault();
      navigate(`${route.path}${url.hash}`);
    },
    [navigate],
  );

  return (
    <div
      className="native-framer-document"
      onClickCapture={handleClickCapture}
      dangerouslySetInnerHTML={{ __html: document.bodyHtml }}
    />
  );
}
