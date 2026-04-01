import { useState, useEffect } from 'react';
import { Menu, X, Trophy, Newspaper } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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

  const navLinks = [
    { label: 'Fixtures', href: '#fixtures' },
    { label: 'Standings', href: '#standings' },
    { label: 'Teams', href: '#teams' },
    { label: 'Travel', href: '#travel' },
    { label: 'News', href: '/news', isExternal: true },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    setIsOpen(false);
    
    if (link.isExternal) {
      // Let the Link component handle navigation
      return;
    }
    
    e.preventDefault();
    
    if (!isHomePage) {
      // If not on home page, navigate to home first then scroll
      window.location.href = '/' + link.href;
    } else {
      // On home page, just scroll
      scrollToSection(link.href);
    }
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
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              link.isExternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* Menu Button - Right */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Desktop Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
        <div className="h-full flex flex-col items-center justify-center">
          <nav className="flex flex-col items-center gap-4 sm:gap-6">
            {navLinks.map((link, index) => (
              link.isExternal ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white text-2xl sm:text-4xl md:text-6xl font-bold hover:text-[#CFFF2E] transition-colors flex items-center gap-3"
                  style={{
                    fontFamily: 'League Spartan, sans-serif',
                    transitionDelay: `${index * 50}ms`,
                    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  {link.label}
                  <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#CFFF2E]" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-white text-2xl sm:text-4xl md:text-6xl font-bold hover:text-[#CFFF2E] transition-colors flex items-center gap-3"
                  style={{
                    fontFamily: 'League Spartan, sans-serif',
                    transitionDelay: `${index * 50}ms`,
                    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  {link.label}
                  {link.label === 'Standings' && <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#CFFF2E]" />}
                </a>
              )
            ))}
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
