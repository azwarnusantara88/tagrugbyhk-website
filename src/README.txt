================================================================================
                    TAG RUGBY HK - COMPLETE COMPONENTS PACKAGE
                    CREATED: 2026-04-09 01:33:57
================================================================================

This package contains ALL components that sync with your Google Sheets.

================================================================================
                           FILES INCLUDED
================================================================================

SERVICES:
  googleSheets.ts          - All fetch functions for Google Sheets

PAGES:
  TeamProfile.tsx          - Individual team profile page
  NewsList.tsx             - Full news listing page
  NewsArticle.tsx          - Single article page

SECTIONS:
  CoverSection.tsx         - Tournament cover/info section
  TeamsSection.tsx         - Teams grid with filters
  FixturesSection.tsx      - Match schedule with filters
  PlayersSection.tsx       - Player profiles with tabs
  NewsSection.tsx          - News preview on homepage
  ContactFooter.tsx        - Contact form + footer
  FanZone.tsx              - Social links + newsletter
  HeroSection.tsx          - Hero with countdown
  Navigation.tsx           - Site navigation
  PartnersSection.tsx      - Partners grid
  TravelSection.tsx        - Travel info + venue map

================================================================================
                           GOOGLE SHEETS SYNC
================================================================================

CONFIG (gid=547146341):
  - CoverSection, HeroSection, Navigation, ContactFooter, FanZone,
    PartnersSection, TravelSection

TEAMS (gid=1773916879):
  - TeamsSection, TeamProfile

FIXTURES (gid=426231149):
  - FixturesSection, TeamProfile

PLAYERS (gid=1609704544):
  - PlayersSection, TeamProfile

NEWS (gid=244646710):
  - NewsSection, NewsList, NewsArticle

LADDER (gid=1095999969):
  - TeamProfile (standings display)

================================================================================
                              DEPLOYMENT STEPS
================================================================================

STEP 1: UPLOAD TO GITHUB
------------------------

1. Go to: https://github.com/azwarnusantara88/tagrugbyhk-website

2. Upload files to correct folders:
   - src/services/googleSheets.ts
   - src/pages/TeamProfile.tsx
   - src/pages/NewsList.tsx
   - src/pages/NewsArticle.tsx
   - src/sections/CoverSection.tsx
   - src/sections/TeamsSection.tsx
   - src/sections/FixturesSection.tsx
   - src/sections/PlayersSection.tsx
   - src/sections/NewsSection.tsx
   - src/sections/ContactFooter.tsx
   - src/sections/FanZone.tsx
   - src/sections/HeroSection.tsx
   - src/sections/Navigation.tsx
   - src/sections/PartnersSection.tsx
   - src/sections/TravelSection.tsx

STEP 2: UPDATE App.tsx
----------------------

Replace old components with new ones:

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

// In your routes:
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

STEP 3: VERIFY BUILD
--------------------

1. Go to Actions tab
2. Wait for green checkmark

================================================================================
                              FEATURES
================================================================================

✅ All components sync with Google Sheets
✅ GSAP animations included
✅ Auto-refresh every 60 seconds
✅ Responsive design (mobile + desktop)
✅ Division filters on Teams/Fixtures
✅ Live countdown timer
✅ Search & category filters on News
✅ Contact form with email integration
✅ Social media links from CONFIG

================================================================================
