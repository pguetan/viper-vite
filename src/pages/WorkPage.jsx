import { FramerDocumentPage } from "../components/FramerDocumentPage.jsx";
import { workFramerDocument } from "../generated/workFramerDocument.js";

export function WorkPage() {
  return <FramerDocumentPage document={workFramerDocument} />;
}
