import { PreservedFramerPage } from "../components/PreservedFramerPage.jsx";
import { sitePages } from "../data/siteRoutes.js";

export function HomePage() {
  return <PreservedFramerPage page={sitePages.home} />;
}
