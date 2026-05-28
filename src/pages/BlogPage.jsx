import { PreservedFramerPage } from "../components/PreservedFramerPage.jsx";
import { sitePages } from "../data/siteRoutes.js";

export function BlogPage() {
  return <PreservedFramerPage page={sitePages.blog} />;
}
