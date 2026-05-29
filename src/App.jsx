import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage.jsx";
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
const AudemarsPiguetPage = lazy(() =>
  import("./pages/AudemarsPiguetPage.jsx").then((module) => ({ default: module.AudemarsPiguetPage })),
);
const BlogPage = lazy(() =>
  import("./pages/BlogPage.jsx").then((module) => ({ default: module.BlogPage })),
);
const GlobalNikonMeetupPage = lazy(() =>
  import("./pages/GlobalNikonMeetupPage.jsx").then((module) => ({
    default: module.GlobalNikonMeetupPage,
  })),
);
const PolestarNewEvPage = lazy(() =>
  import("./pages/PolestarNewEvPage.jsx").then((module) => ({ default: module.PolestarNewEvPage })),
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
      <Route path="/blog" element={lazyPage(<BlogPage />)} />
      <Route path="/blog/polestar-new-ev" element={lazyPage(<PolestarNewEvPage />)} />
      <Route path="/blog/audemars-piguet" element={lazyPage(<AudemarsPiguetPage />)} />
      <Route path="/blog/global-nikon-meetup" element={lazyPage(<GlobalNikonMeetupPage />)} />
      <Route path="/contact" element={lazyPage(<ContactPage />)} />
      <Route path="/__reference/*" element={<ReferencePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
