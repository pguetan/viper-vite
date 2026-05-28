import { FramerPageFrame } from "./FramerPageFrame.jsx";

export function PreservedFramerPage({ page }) {
  return <FramerPageFrame title={page.title} source={page.mirrorPath} />;
}
