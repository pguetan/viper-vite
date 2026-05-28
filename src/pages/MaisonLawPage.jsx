import { FramerDocumentPage } from "../components/FramerDocumentPage.jsx";
import { maisonLawFramerDocument } from "../generated/maisonLawFramerDocument.js";

export function MaisonLawPage() {
  return <FramerDocumentPage document={maisonLawFramerDocument} />;
}
