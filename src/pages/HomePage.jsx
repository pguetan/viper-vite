import { FramerDocumentPage } from "../components/FramerDocumentPage.jsx";
import { homeFramerDocument } from "../generated/homeFramerDocument.js";

export function HomePage() {
  return <FramerDocumentPage document={homeFramerDocument} />;
}
