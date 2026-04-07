import { Routes, Route } from 'react-router-dom';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import TournamentOverview from './sections/TournamentOverview';
import FixturesSection from './sections/FixturesSection';
import PlayersToWatch from './sections/PlayersToWatch';
import NewsSection from './sections/NewsSection';
import PartnersSection from './sections/PartnersSection';
import FanZone from './sections/FanZone';
import TravelSection from './sections/TravelSection';
import ContactFooter from './sections/ContactFooter';
import TeamProfilePage from './pages/TeamProfile';
import NewsListPage from './pages/NewsList';
import NewsArticlePage from './pages/NewsArticle';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-[#0B3D2E]">
          <Navigation />
          <HeroSection />
          <TournamentOverview />
          <FixturesSection />
          <PlayersToWatch />
          <NewsSection />
          <PartnersSection />
          <FanZone />
          <TravelSection />
          <ContactFooter />
        </div>
      } />
      <Route path="/team/:teamId" element={<TeamProfilePage />} />
      <Route path="/news" element={<NewsListPage />} />
      <Route path="/news/:slug" element={<NewsArticlePage />} />
    </Routes>
  );
}

export default App;
