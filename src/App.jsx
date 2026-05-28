import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage.jsx";
import { AudemarsPiguetPage } from "./pages/AudemarsPiguetPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { GlobalNikonMeetupPage } from "./pages/GlobalNikonMeetupPage.jsx";
import { MaisonLawPage } from "./pages/MaisonLawPage.jsx";
import { MysticMeadowsPage } from "./pages/MysticMeadowsPage.jsx";
import { PolestarNewEvPage } from "./pages/PolestarNewEvPage.jsx";
import { RavenClawPage } from "./pages/RavenClawPage.jsx";
import { ReferencePage } from "./pages/ReferencePage.jsx";
import { WillowStudioPage } from "./pages/WillowStudioPage.jsx";
import { WorkPage } from "./pages/WorkPage.jsx";

const ContactPage = lazy(() =>
  import("./pages/ContactPage.jsx").then((module) => ({ default: module.ContactPage })),
);
const HomePage = lazy(() =>
  import("./pages/HomePage.jsx").then((module) => ({ default: module.HomePage })),
);

function lazyPage(element) {
  return <Suspense fallback={null}>{element}</Suspense>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={lazyPage(<HomePage />)} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/work/raven-claw" element={<RavenClawPage />} />
      <Route path="/work/willow-studio" element={<WillowStudioPage />} />
      <Route path="/work/maison-law" element={<MaisonLawPage />} />
      <Route path="/work/mystic-meadows" element={<MysticMeadowsPage />} />
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
