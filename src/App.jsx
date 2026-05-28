import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage.jsx";
import { AudemarsPiguetPage } from "./pages/AudemarsPiguetPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { GlobalNikonMeetupPage } from "./pages/GlobalNikonMeetupPage.jsx";
import { PolestarNewEvPage } from "./pages/PolestarNewEvPage.jsx";
import { ReferencePage } from "./pages/ReferencePage.jsx";

const ContactPage = lazy(() =>
  import("./pages/ContactPage.jsx").then((module) => ({ default: module.ContactPage })),
);
const HomePage = lazy(() =>
  import("./pages/HomePage.jsx").then((module) => ({ default: module.HomePage })),
);
const MysticMeadowsPage = lazy(() =>
  import("./pages/MysticMeadowsPage.jsx").then((module) => ({ default: module.MysticMeadowsPage })),
);
const MaisonLawPage = lazy(() =>
  import("./pages/MaisonLawPage.jsx").then((module) => ({ default: module.MaisonLawPage })),
);
const RavenClawPage = lazy(() =>
  import("./pages/RavenClawPage.jsx").then((module) => ({ default: module.RavenClawPage })),
);
const WillowStudioPage = lazy(() =>
  import("./pages/WillowStudioPage.jsx").then((module) => ({ default: module.WillowStudioPage })),
);
const WorkPage = lazy(() =>
  import("./pages/WorkPage.jsx").then((module) => ({ default: module.WorkPage })),
);

function lazyPage(element) {
  return <Suspense fallback={null}>{element}</Suspense>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={lazyPage(<HomePage />)} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/work" element={lazyPage(<WorkPage />)} />
      <Route path="/work/raven-claw" element={lazyPage(<RavenClawPage />)} />
      <Route path="/work/willow-studio" element={lazyPage(<WillowStudioPage />)} />
      <Route path="/work/maison-law" element={lazyPage(<MaisonLawPage />)} />
      <Route path="/work/mystic-meadows" element={lazyPage(<MysticMeadowsPage />)} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/polestar-new-ev" element={<PolestarNewEvPage />} />
      <Route path="/blog/audemars-piguet" element={<AudemarsPiguetPage />} />
      <Route path="/blog/global-nikon-meetup" element={<GlobalNikonMeetupPage />} />
      <Route path="/contact" element={lazyPage(<ContactPage />)} />
      <Route path="/__reference/*" element={<ReferencePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
