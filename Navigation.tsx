import { useState, useEffect } from 'react';
import { Menu, X, Trophy, Newspaper, ChevronDown, Download, Calendar, MapPin, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter fixtures by date
  const filterFixturesByDate = (date: string) => {
    setIsOpen(false);
    if (!isHomePage) {
      window.location.href = '/#fixtures';
      return;
    }
    const element = document.querySelector('#fixtures');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to filter fixtures
      window.dispatchEvent(new CustomEvent('filterFixtures', { detail: { date } }));
    }
  };

  // Filter teams by region
  const filterTeamsByRegion = (region: string) => {
    setIsOpen(false);
    if (!isHomePage) {
      window.location.href = '/#teams';
      return;
    }
    const element = document.querySelector('#teams');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to filter teams
      window.dispatchEvent(new CustomEvent('filterTeams', { detail: { region } }));
    }
  };

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    if (!isHomePage) {
      window.location.href = '/' + href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string, isExternal?: boolean) => {
    if (isExternal) {
      setIsOpen(false);
      return;
    }
    
    e.preventDefault();
    scrollToSection(href);
  };

  // Download fixtures PDF
  const downloadFixturesPDF = () => {
    // This will be implemented when PDF is available
    alert('Fixtures PDF download coming soon!');
  };

  return (
    <>
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B3D2E]/90 backdrop-blur-md py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo - Left */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white"
          >
            <span 
              className="font-bold text-xl tracking-tight"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              HKTR
            </span>
            <span className="w-2 h-2 bg-[#CFFF2E] rounded-full" />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {/* Fixtures Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors outline-none">
                Fixtures
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0B3D2E] border-[#145A42]">
                <DropdownMenuItem 
                  onClick={() => filterFixturesByDate('2026-04-11')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Saturday, April 11
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => filterFixturesByDate('2026-04-12')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Sunday, April 12
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => filterFixturesByDate('all')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  All divisions
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={downloadFixturesPDF}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download all match fixtures (PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Standings - Direct Link */}
            <a
              href="#standings"
              onClick={(e) => handleNavClick(e, '#standings')}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Standings
            </a>

            {/* Teams Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors outline-none">
                Teams
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0B3D2E] border-[#145A42]">
                <DropdownMenuItem 
                  onClick={() => filterTeamsByRegion('Hong Kong')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Hong Kong
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => filterTeamsByRegion('Japan')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Japan
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => filterTeamsByRegion('AusAsia')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  AusAsia
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => filterTeamsByRegion('all')}
                  className="text-white/80 hover:text-white hover:bg-[#145A42] cursor-pointer"
                >
                  <Users className="w-4 h-4 mr-2" />
                  All Regions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Travel - Direct Link */}
            <a
              href="#travel"
              onClick={(e) => handleNavClick(e, '#travel')}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Travel
            </a>

            {/* News - External Link */}
            <Link
              to="/news"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              News
            </Link>

            {/* Contact - Direct Link */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Menu Button - Right */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0B3D2E] transition-all duration-500 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col items-center justify-center px-4">
          <nav className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Mobile Fixtures Section */}
            <div className="text-center">
              <span className="text-white/60 text-sm uppercase tracking-wider">Fixtures</span>
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => filterFixturesByDate('2026-04-11')}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors"
                >
                  Saturday, April 11
                </button>
                <button 
                  onClick={() => filterFixturesByDate('2026-04-12')}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors"
                >
                  Sunday, April 12
                </button>
                <button 
                  onClick={() => filterFixturesByDate('all')}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors"
                >
                  All Divisions
                </button>
                <button 
                  onClick={downloadFixturesPDF}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Standings */}
            <a
              href="#standings"
              onClick={(e) => handleNavClick(e, '#standings')}
              className="text-white text-2xl sm:text-4xl font-bold hover:text-[#CFFF2E] transition-colors flex items-center gap-3"
            >
              Standings
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-[#CFFF2E]" />
            </a>

            {/* Mobile Teams Section */}
            <div className="text-center">
              <span className="text-white/60 text-sm uppercase tracking-wider">Teams</span>
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => filterTeamsByRegion('Hong Kong')}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors"
                >
                  Hong Kong
                </button>
                <button 
                  onClick={() => filterTeamsByRegion('Japan')}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors"
                >
                  Japan
                </button>
                <button 
                  onClick={() => filterTeamsByRegion('AusAsia')}
                  className="text-white text-xl sm:text-2xl font-medium hover:text-[#CFFF2E] transition-colors"
                >
                  AusAsia
                </button>
              </div>
            </div>

            {/* Travel */}
            <a
              href="#travel"
              onClick={(e) => handleNavClick(e, '#travel')}
              className="text-white text-2xl sm:text-4xl font-bold hover:text-[#CFFF2E] transition-colors"
            >
              Travel
            </a>

            {/* News */}
            <Link
              to="/news"
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl sm:text-4xl font-bold hover:text-[#CFFF2E] transition-colors flex items-center gap-3"
            >
              News
              <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-[#CFFF2E]" />
            </Link>

            {/* Contact */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-white text-2xl sm:text-4xl font-bold hover:text-[#CFFF2E] transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Live Updates Pill */}
          <div className="mt-8 sm:mt-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E] text-[#0B3D2E] rounded-full font-semibold text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Updates
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
