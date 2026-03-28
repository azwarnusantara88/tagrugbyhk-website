import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Crown, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TeamRoster = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rosterCardRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);

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
        rosterCardRef.current,
        { x: '-70vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.roster-h2',
        { x: '30vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.roster-body',
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        '.roster-cta',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.12
      );

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl.fromTo(
        rosterCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.roster-h2, .roster-body, .roster-cta',
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.roster-bg',
        { scale: 1 },
        { scale: 1.05, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const squadMembers = [
    'T. Lau (C)',
    'M. Cheng (C)',
    'K. Wong',
    'J. Lee',
    'A. Chan',
    'R. Ho',
    'S. Tam',
    'P. Yuen',
    'D. Chiu',
    'L. Ng',
    'B. Mak',
    'E. Cheung',
  ];

  return (
    <section
      ref={sectionRef}
      id="teams"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="roster-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/team_training.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/70 md:bg-[#0B3D2E]/65" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center">
          {/* Left: Roster Card */}
          <div
            ref={rosterCardRef}
            className="card-white overflow-hidden order-2 md:order-1"
          >
            {/* Team Photo Strip */}
            <div
              className="h-24 sm:h-32 md:h-40 bg-cover bg-center"
              style={{ backgroundImage: 'url(/pitch_corner.jpg)' }}
            />

            {/* Roster Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E] flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B3D2E]" />
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl font-bold text-[#0B3D2E]"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    Open Squad
                  </h3>
                  <p className="text-[#0B3D2E]/60 text-xs sm:text-sm">
                    18 Players • Tag Asia Cup 2026
                  </p>
                </div>
              </div>

              {/* Captains */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6 p-2 sm:p-3 bg-[#CFFF2E]/10 rounded-lg sm:rounded-xl">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFFF2E]" />
                <span className="text-[#0B3D2E] text-xs sm:text-sm font-medium">
                  Captains: T. Lau / M. Cheng
                </span>
              </div>

              {/* Player Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {squadMembers.map((player, index) => (
                  <div
                    key={index}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#0B3D2E]/5 rounded-lg text-center"
                  >
                    <span className="text-[#0B3D2E] text-[10px] sm:text-sm font-medium">
                      {player}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div ref={textGroupRef} className="space-y-4 sm:space-y-6 order-1 md:order-2 text-center md:text-left">
            <h2
              className="roster-h2 text-3xl sm:text-4xl lg:text-5xl text-white font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              THE
              <br />
              <span className="text-[#CFFF2E]">SQUAD</span>
            </h2>

            <p className="roster-body text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              A balanced mix of speed, experience, and defensive grit. Meet
              the players representing Hong Kong on the international stage
              for the first time.
            </p>

            <button className="roster-cta inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-bold transition-all text-sm sm:text-base">
              Full Player Profiles
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8 max-w-xs mx-auto md:mx-0">
              {[
                { label: 'Players', value: '18' },
                { label: 'Caps', value: '240+' },
                { label: 'Avg Age', value: '26' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-2 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm"
                >
                  <div
                    className="text-xl sm:text-2xl font-black text-[#CFFF2E]"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-[10px] sm:text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamRoster;
