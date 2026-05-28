import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { siteRoutes } from "../data/siteRoutes.js";

function routeFromMirrorPath(pathname) {
  return siteRoutes.find((route) => {
    const mirrorDirectory = route.mirrorPath.replace(/index\.html$/, "");
    return route.mirrorPath === pathname || mirrorDirectory === pathname;
  });
}

export function FramerPageFrame({ source, title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoad = useCallback(
    (event) => {
      const frameWindow = event.currentTarget.contentWindow;
      if (!frameWindow) return;

      try {
        const route = routeFromMirrorPath(frameWindow.location.pathname);
        if (route && route.path !== location.pathname) {
          navigate(route.path);
        }
      } catch {
        // The mirrored site is same-origin locally, but keep this resilient for unusual deploy setups.
      }
    },
    [location.pathname, navigate],
  );

  return (
    <main className="app-shell" aria-label={title}>
      <iframe className="site-frame" src={source} title={title} onLoad={handleLoad} />
    </main>
  );
}
