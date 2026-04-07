import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Swords, Layers, ArrowRight } from 'lucide-react';
import { fetchConfig, type Config } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const TournamentOverview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState<Config>({
    informationPackUrl: '',
    tournamentName: 'Tag Asia Cup 2026',
    tournamentDate: 'April 11-12, 2026',
    venue: 'J-Green Sakai City',
  });

  // Fetch config from Google Sheets on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchConfig();
        setConfig(data);
      } catch (err) {
        console.warn('Failed to load config, using defaults:', err);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // Skip scroll animation on mobile

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=70%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        infoCardRef.current,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.overview-h2',
        { x: '40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      scrollTl.fromTo(
        textGroupRef.current,
        { x: '35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        thumbnailRef.current,
        { x: '50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.15
      );

      // SETTLE (30-70%): Static viewing - no animation

      // EXIT (70-100%)
      scrollTl.fromTo(
        infoCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.overview-h2',
        { x: 0, opacity: 1 },
        { x: '30vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        textGroupRef.current,
        { x: 0, opacity: 1 },
        { x: '25vw', opacity: 0, ease: 'power2.in' },
        0.74
      );

      scrollTl.fromTo(
        thumbnailRef.current,
        { x: 0, opacity: 1 },
        { x: '35vw', opacity: 0, ease: 'power2.in' },
        0.76
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

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_midfield.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/75 md:bg-[#0B3D2E]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          
          {/* Left Column - Info Card */}
          <div
            ref={infoCardRef}
            className="w-full lg:w-[45%] bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-[#CFFF2E]" />
              <span className="text-[#CFFF2E] font-semibold text-xs sm:text-sm uppercase tracking-wider">
                Tournament Overview
              </span>
            </div>
            
            <h2 className="overview-h2 text-3xl sm:text-4xl lg:text-5xl text-white font-black mb-4 sm:mb-6">
              TAG ASIA CUP <span className="text-[#CFFF2E]">2026</span>
            </h2>

            <div ref={textGroupRef} className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#CFFF2E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Dates</p>
                  <p className="text-white/70 text-sm sm:text-base">{config.tournamentDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#CFFF2E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Venue</p>
                  <p className="text-white/70 text-sm sm:text-base">{config.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#CFFF2E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Format</p>
                  <p className="text-white/70 text-sm sm:text-base">4 Divisions · 16 Teams · 29 Matches</p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollToSection('#fixtures')}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-semibold transition-all text-sm"
              >
                View Fixtures
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {config.informationPackUrl && (
                <a
                  href={config.informationPackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-semibold transition-all text-sm"
                >
                  Download Info Pack
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Thumbnail Image */}
          <div
            ref={thumbnailRef}
            className="w-full lg:w-[55%] aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10"
          >
            <img
              src="/hero_pitch.jpg"
              alt="Tournament venue"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentOverview;
