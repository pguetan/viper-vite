import { FramerPageFrame } from "./FramerPageFrame.jsx";

export function PreservedFramerPage({ page, syncRoute = true }) {
  return <FramerPageFrame title={page.title} source={page.mirrorPath} syncRoute={syncRoute} />;
}
