import { Navigate, Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage.jsx";
import { AudemarsPiguetPage } from "./pages/AudemarsPiguetPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { GlobalNikonMeetupPage } from "./pages/GlobalNikonMeetupPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { MaisonLawPage } from "./pages/MaisonLawPage.jsx";
import { MysticMeadowsPage } from "./pages/MysticMeadowsPage.jsx";
import { PolestarNewEvPage } from "./pages/PolestarNewEvPage.jsx";
import { RavenClawPage } from "./pages/RavenClawPage.jsx";
import { WillowStudioPage } from "./pages/WillowStudioPage.jsx";
import { WorkPage } from "./pages/WorkPage.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
