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
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
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
      className="section-pinned z-40"
    >
      {/* Background Image */}
      <div
        className="roster-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/team_training.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/65" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6 lg:px-12 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Roster Card */}
            <div
              ref={rosterCardRef}
              className="card-white overflow-hidden"
            >
              {/* Team Photo Strip */}
              <div
                className="h-40 bg-cover bg-center"
                style={{ backgroundImage: 'url(/pitch_corner.jpg)' }}
              />

              {/* Roster Content */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#CFFF2E] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#0B3D2E]" />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-bold text-[#0B3D2E]"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      Open Squad
                    </h3>
                    <p className="text-[#0B3D2E]/60 text-sm">
                      18 Players • Tag Asia Cup 2026
                    </p>
                  </div>
                </div>

                {/* Captains */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-[#CFFF2E]/10 rounded-xl">
                  <Crown className="w-5 h-5 text-[#CFFF2E]" />
                  <span className="text-[#0B3D2E] text-sm font-medium">
                    Captains: T. Lau / M. Cheng
                  </span>
                </div>

                {/* Player Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {squadMembers.map((player, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-[#0B3D2E]/5 rounded-lg text-center"
                    >
                      <span className="text-[#0B3D2E] text-sm font-medium">
                        {player}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div ref={textGroupRef} className="space-y-6">
              <h2
                className="roster-h2 text-4xl sm:text-5xl lg:text-6xl text-white font-black"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                THE
                <br />
                <span className="text-[#CFFF2E]">SQUAD</span>
              </h2>

              <p className="roster-body text-white/80 text-lg leading-relaxed max-w-lg">
                A balanced mix of speed, experience, and defensive grit. Meet
                the players representing Hong Kong on the international stage
                for the first time.
              </p>

              <button className="roster-cta btn-primary inline-flex items-center gap-2">
                Full Player Profiles
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { label: 'Players', value: '18' },
                  { label: 'Caps', value: '240+' },
                  { label: 'Avg Age', value: '26' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                  >
                    <div
                      className="text-2xl font-black text-[#CFFF2E]"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamRoster;
