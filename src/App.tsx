import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import CoverSection from './sections/CoverSection';
import TeamsSection from './sections/TeamsSection';
import FixturesSection from './sections/FixturesSection';
import PlayersSection from './sections/PlayersSection';
import NewsSection from './sections/NewsSection';
import TravelSection from './sections/TravelSection';
import PartnersSection from './sections/PartnersSection';
import FanZone from './sections/FanZone';
import ContactFooter from './sections/ContactFooter';
import TeamProfile from './pages/TeamProfile';
import NewsList from './pages/NewsList';
import NewsArticle from './pages/NewsArticle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Navigation />
            <HeroSection />
            <CoverSection />
            <TeamsSection />
            <FixturesSection />
            <PlayersSection />
            <NewsSection />
            <TravelSection />
            <PartnersSection />
            <FanZone />
            <ContactFooter />
          </>
        } />
        <Route path="/team/:teamId" element={<TeamProfile />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
