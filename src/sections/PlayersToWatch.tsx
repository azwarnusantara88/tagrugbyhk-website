import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Player {
  name: string;
  position: string;
  stats: string;
  highlight: string;
}

const PlayersToWatch = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const players: Player[] = [
    { name: 'T. Lau', position: 'Captain', stats: '45 Caps', highlight: 'Top Try Scorer' },
    { name: 'M. Cheng', position: 'Captain', stats: '38 Caps', highlight: 'Playmaker' },
    { name: 'K. Wong', position: 'Winger', stats: '32 Caps', highlight: 'Speedster' },
    { name: 'J. Lee', position: 'Center', stats: '28 Caps', highlight: 'Defensive Wall' },
  ];

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

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headingRef.current,
        { x: '-35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      const cards = cardsRef.current?.querySelectorAll('.player-card');
      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          index * 0.06
        );
      });

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl.fromTo(
        headingRef.current,
        { x: 0, opacity: 1 },
        { x: '-25vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '16vh', opacity: 0, ease: 'power2.in', stagger: 0.03 },
          0.7 + index * 0.03
        );
      });

      scrollTl.fromTo(
        '.players-bg',
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="players"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="players-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_corner.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/75 md:bg-[#0B3D2E]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:gap-12 items-start">
          {/* Left: Heading */}
          <div ref={headingRef} className="lg:col-span-4 space-y-2 sm:space-y-4 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-white font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              PLAYERS
              <br />
              <span className="text-[#CFFF2E]">TO WATCH</span>
            </h2>
            <p className="text-white/70 text-sm sm:text-base lg:text-lg">
              Key players representing Hong Kong at the Tag Asia Cup 2026.
            </p>

            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-full">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#CFFF2E]" />
              <span className="text-white/80 text-xs sm:text-sm">
                Star Performers
              </span>
            </div>
          </div>

          {/* Right: Players Grid */}
          <div ref={cardsRef} className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="player-card card-white p-3 sm:p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                      <Star className="w-4 h-4 sm:w-6 sm:h-6 text-[#0B3D2E]" />
                    </div>
                    <div
                      className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B3D2E]"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      {player.name}
                    </div>
                  </div>
                  <div className="text-[#0B3D2E]/60 text-xs sm:text-sm font-medium mb-1">
                    {player.position}
                  </div>
                  <div className="text-[#CFFF2E] bg-[#0B3D2E] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold inline-block">
                    {player.highlight}
                  </div>
                  <div className="mt-2 sm:mt-3 text-[#0B3D2E]/80 text-xs sm:text-sm">
                    {player.stats}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4">
              {[
                { label: 'Total Caps', value: '240+' },
                { label: 'Avg Age', value: '26' },
                { label: 'Experience', value: 'High' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="player-card bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-4 text-center"
                >
                  <div
                    className="text-lg sm:text-2xl font-bold text-[#CFFF2E]"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    {item.value}
                  </div>
                  <div className="text-white/60 text-[10px] sm:text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayersToWatch;
