import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import TournamentOverview from './sections/TournamentOverview';
import FixturesSection from './sections/FixturesSection';
import TeamRoster from './sections/TeamRoster';
import TravelSection from './sections/TravelSection';
import StatsSection from './sections/StatsSection';
import FanZone from './sections/FanZone';
import PartnersSection from './sections/PartnersSection';
import ContactFooter from './sections/ContactFooter';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global snap for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative">
        {/* Section 1: Hero */}
        <HeroSection />
        
        {/* Section 2: Tournament Overview */}
        <TournamentOverview />
        
        {/* Section 3: Fixtures */}
        <FixturesSection />
        
        {/* Section 4: Team Roster */}
        <TeamRoster />
        
        {/* Section 5: Travel & Stay */}
        <TravelSection />
        
        {/* Section 6: Stats */}
        <StatsSection />
        
        {/* Section 7: Fan Zone */}
        <FanZone />
        
        {/* Section 8: Partners */}
        <PartnersSection />
        
        {/* Section 9: Contact + Footer */}
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;
