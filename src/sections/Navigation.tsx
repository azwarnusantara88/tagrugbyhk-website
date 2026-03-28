import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Fixtures', href: '#fixtures' },
    { label: 'Teams', href: '#teams' },
    { label: 'Travel', href: '#travel' },
    { label: 'Updates', href: '#fanzone' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-white"
          >
            <span 
              className="font-bold text-xl tracking-tight"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              HKTR
            </span>
            <span className="w-2 h-2 bg-[#CFFF2E] rounded-full" />
          </a>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
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
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-white text-4xl md:text-6xl font-bold hover:text-[#CFFF2E] transition-colors"
                style={{
                  fontFamily: 'League Spartan, sans-serif',
                  transitionDelay: `${index * 50}ms`,
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Live Updates Pill */}
          <div className="mt-12">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#CFFF2E] text-[#0B3D2E] rounded-full font-semibold text-sm">
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
