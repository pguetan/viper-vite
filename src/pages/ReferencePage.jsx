import { Navigate, useLocation } from "react-router-dom";
import { PreservedFramerPage } from "../components/PreservedFramerPage.jsx";
import { pageForPath, sitePages } from "../data/siteRoutes.js";

function referencePath(pathname) {
  const path = pathname.replace(/^\/__reference/, "") || "/";
  return path === "/" ? path : path.replace(/\/$/, "");
}

export function ReferencePage() {
  const location = useLocation();
  const page = pageForPath(referencePath(location.pathname));

  if (!page) {
    return <Navigate to="/__reference/" replace />;
  }

  return <PreservedFramerPage page={page || sitePages.home} syncRoute={false} />;
}
