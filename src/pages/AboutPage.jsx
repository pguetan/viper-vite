import { PreservedFramerPage } from "../components/PreservedFramerPage.jsx";
import { sitePages } from "../data/siteRoutes.js";

export function AboutPage() {
  return <PreservedFramerPage page={sitePages.about} />;
}
