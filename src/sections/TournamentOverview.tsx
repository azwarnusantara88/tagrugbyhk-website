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
    tournamentDates: 'April 11-12, 2026',
    venue: 'J-Green Sakai City',
  });

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
        },
      });

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
        0
      );

      scrollTl.fromTo(
        '.overview-body',
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.06
      );

      scrollTl.fromTo(
        '.overview-cta',
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        thumbnailRef.current,
        { y: '18vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      scrollTl.fromTo(
        infoCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.overview-h2, .overview-body, .overview-cta',
        { x: 0, opacity: 1 },
        { x: '35vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        thumbnailRef.current,
        { y: 0, opacity: 1 },
        { y: '16vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        '.overview-bg',
        { scale: 1 },
        { scale: 1.05, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openInformationPack = () => {
    if (config.informationPackUrl) {
      window.open(config.informationPackUrl, '_blank');
    } else {
      window.open('/information-pack.pdf', '_blank');
    }
  };

  // FIXED DIVISIONS - No more U18/U16
  const tournamentDetails = [
    { icon: Calendar, label: 'Date', value: config.tournamentDates },
    { icon: MapPin, label: 'Venue', value: config.venue },
    { icon: Swords, label: 'Format', value: 'Round-robin → Knockout' },
    { icon: Layers, label: 'Divisions', value: 'Mixed Open / Mens Open / Womens Open / Senior Mens' },
  ];

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="overview-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_midfield_new.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/60 md:bg-[#0B3D2E]/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center">
          {/* Left: Info Card */}
          <div
            ref={infoCardRef}
            className="card-white p-4 sm:p-6 lg:p-8 order-2 md:order-1"
          >
            <h3
              className="text-xl sm:text-2xl font-bold text-[#0B3D2E] mb-4 sm:mb-6"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              Tournament Details
            </h3>

            <div className="space-y-3 sm:space-y-5">
              {tournamentDetails.map((detail, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center flex-shrink-0">
                    <detail.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B3D2E]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-[#0B3D2E]/60 uppercase tracking-wider">
                      {detail.label}
                    </div>
                    <div className="text-sm sm:text-base text-[#0B3D2E] font-semibold">
                      {detail.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text Content */}
          <div ref={textGroupRef} className="space-y-4 sm:space-y-6 order-1 md:order-2 text-center md:text-left">
            <h2
              className="overview-h2 text-3xl sm:text-4xl lg:text-5xl text-white font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              J-GREEN
              <br />
              <span className="text-[#CFFF2E]">SAKAI</span>
            </h2>

            <p className="overview-body text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              A world-class rugby venue in Osaka. Two days of fast-paced
              international tag. Live updates, video highlights, and
              play-by-play coverage.
            </p>

            <button
              onClick={openInformationPack}
              className="overview-cta inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-[#CFFF2E] text-[#CFFF2E] font-bold rounded-full hover:bg-[#CFFF2E] hover:text-[#0B3D2E] transition-all text-sm sm:text-base"
            >
              Get Travel Info
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Matchday Thumbnail */}
            <div
              ref={thumbnailRef}
              className="mt-4 sm:mt-8 card-white p-3 sm:p-4 flex items-center gap-3 sm:gap-4 max-w-xs mx-auto md:mx-0"
            >
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: 'url(/pitch_close.jpg)' }}
              />
              <div>
                <div className="text-xs sm:text-sm text-[#0B3D2E]/60">Matchday</div>
                <div className="text-sm sm:text-base text-[#0B3D2E] font-bold">Day 1 & 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TournamentOverview;
