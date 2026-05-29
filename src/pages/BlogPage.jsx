import { FramerDocumentPage } from "../components/FramerDocumentPage.jsx";
import { blogFramerDocument } from "../generated/blogFramerDocument.js";

export function BlogPage() {
  return <FramerDocumentPage document={blogFramerDocument} />;
}
