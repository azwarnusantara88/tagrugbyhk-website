import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Trophy, Users, Info, ArrowRight } from 'lucide-react';
import { fetchConfig, fetchTeams, fetchFixtures, type Config } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [config, setConfig] = useState<Config | null>(null);
  const [teamCount, setTeamCount] = useState(16);
  const [matchCount, setMatchCount] = useState(29);
  const [divisionCount, setDivisionCount] = useState(4);

  // Load config and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const [configData, teamsData, fixturesData] = await Promise.all([
          fetchConfig(),
          fetchTeams(),
          fetchFixtures(),
        ]);

        setConfig(configData);
        setTeamCount(teamsData.filter(t => t.active).length);
        setMatchCount(fixturesData.length);

        // Count unique divisions
        const divisions = new Set(teamsData.map(t => t.division).filter(Boolean));
        setDivisionCount(divisions.size || 4);
      } catch (err) {
        console.error('Failed to load hero data:', err);
      }
    };

    loadData();
  }, []);

  // Countdown timer
  useEffect(() => {
    const eventDate = config?.eventDate || 'April 11-12, 2026';
    // Parse event date (assuming format like "April 11-12, 2026")
    const dateMatch = eventDate.match(/(\w+)\s+(\d+)/);
    const targetDate = dateMatch
      ? new Date(`2026-${getMonthNumber(dateMatch[1])}-${dateMatch[2]}T09:00:00+09:00`)
      : new Date('2026-04-11T09:00:00+09:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [config]);

  const getMonthNumber = (monthName: string): string => {
    const months: Record<string, string> = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12'
    };
    return months[monthName.toLowerCase()] || '04';
  };

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background scale
      tl.fromTo(
        '.hero-bg',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9 },
        0
      );

      // Logo animation
      tl.fromTo(
        '.hero-logo',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.2
      );

      // Title animation
      tl.fromTo(
        '.hero-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.3
      );

      // Subtitle animation
      tl.fromTo(
        '.hero-subtitle',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.4
      );

      // Countdown animation
      tl.fromTo(
        '.hero-countdown',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.5
      );

      // Stats animation
      tl.fromTo(
        '.hero-stats',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.6
      );

      // CTA animation
      tl.fromTo(
        '.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation - DISABLED on mobile for better UX
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=70%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onLeaveBack: () => {
            gsap.set('.hero-logo, .hero-title, .hero-subtitle, .hero-countdown, .hero-stats, .hero-cta', {
              y: 0, opacity: 1
            });
            gsap.set('.hero-bg', { scale: 1 });
          },
        },
      });

      scrollTl.fromTo(
        '.hero-content',
        { y: 0, opacity: 1 },
        { y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.hero-bg',
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tournamentName = config?.tournamentName || 'TAG ASIA CUP';
  const location = config?.location || 'J-Green Sakai, Osaka';
  const eventDate = config?.eventDate || 'April 11-12, 2026';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
      style={{ paddingTop: '80px', paddingBottom: '40px' }}
    >
      {/* Background Image */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero_pitch.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/70 md:bg-[#0B3D2E]/65" />
      </div>

      {/* Content - Centered Layout */}
      <div className="hero-content relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Tag Asia Cup Logo - Better mobile scaling with max height */}
        <div className="hero-logo mb-4 md:mb-6">
          <img
            src="/logo.png"
            alt={tournamentName}
            className="h-20 sm:h-24 md:h-32 lg:h-40 w-auto object-contain drop-shadow-2xl"
            style={{ maxHeight: '25vh' }}
          />
        </div>

        {/* Title */}
        <div className="hero-title text-center mb-3 md:mb-4">
          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white font-black leading-tight"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            {tournamentName.split(' ').slice(0, -1).join(' ')}
          </h1>
          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[#CFFF2E] font-black leading-tight"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            {tournamentName.split(' ').pop()}
          </h1>
        </div>

        {/* Subtitle */}
        <div className="hero-subtitle text-center mb-5 md:mb-6 px-2">
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-1">
            Hong Kong Tag Rugby's first ITF-sanctioned tournament.
          </p>
          <p className="text-[#CFFF2E] text-sm sm:text-base md:text-lg">
            {location}
          </p>
          <p className="text-white/70 text-sm sm:text-base md:text-lg">
            {eventDate}
          </p>
        </div>

        {/* Countdown with Fixed Width Number Boxes */}
        <div className="hero-countdown mb-5 md:mb-6">
          <div className="text-center">
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-3">
              Tournament Starts In
            </p>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-4">
              {[
                { value: timeLeft.days, label: 'DAYS' },
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-10 h-12 sm:w-12 sm:h-14 md:w-20 md:h-24 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl border border-white/20"
                  >
                    <span
                      className="text-lg sm:text-xl md:text-4xl font-black text-white tabular-nums"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/50 uppercase mt-1 md:mt-2 tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[#CFFF2E]/60 text-xs md:text-sm mt-2 md:mt-3 animate-pulse">
              Kickoff
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="hero-stats flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 mb-5 md:mb-6">
          {[
            { icon: Users, value: teamCount.toString(), label: 'Teams' },
            { icon: Trophy, value: matchCount.toString(), label: 'Matches' },
            { icon: Calendar, value: divisionCount.toString(), label: 'Divs' },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full"
            >
              <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-[#CFFF2E]" />
              <div className="flex items-center gap-1">
                <span
                  className="text-base md:text-xl font-bold text-white"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  {stat.value}
                </span>
                <span className="text-white/70 text-xs md:text-sm">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3 CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={() => scrollToSection('#overview')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all text-sm"
          >
            <Info className="w-4 h-4" />
            Tournament Info
          </button>
          <button
            onClick={() => scrollToSection('#fixtures')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-semibold transition-all text-sm"
          >
            <Calendar className="w-4 h-4" />
            View Fixtures
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection('#players')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-all text-sm"
          >
            <Trophy className="w-4 h-4" />
            Players to Watch
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
