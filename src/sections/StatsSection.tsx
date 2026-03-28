import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Shield, Target, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);

  const stats: StatItem[] = [
    { icon: TrendingUp, value: 4.8, suffix: 's', label: 'Avg Try Time' },
    { icon: Shield, value: 82, suffix: '%', label: 'Tackle Success' },
    { icon: Target, value: 12, suffix: '', label: 'Tournament Tries' },
    { icon: Award, value: 3, suffix: '', label: 'Clean Sheets' },
  ];

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
          onUpdate: (self) => {
            // Animate numbers during entrance (10-30%)
            if (self.progress >= 0.1 && self.progress <= 0.3) {
              const progress = (self.progress - 0.1) / 0.2;
              setAnimatedValues(stats.map((stat) => stat.value * progress));
            } else if (self.progress > 0.3) {
              setAnimatedValues(stats.map((stat) => stat.value));
            }
          },
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headingRef.current,
        { x: '-35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      const cards = cardsRef.current?.querySelectorAll('.stat-card');
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
        '.stats-bg',
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatValue = (value: number, index: number) => {
    const stat = stats[index];
    if (stat.suffix === 's') {
      return value.toFixed(1);
    }
    return Math.round(value).toString();
  };

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="section-pinned z-[60]"
    >
      {/* Background Image */}
      <div
        className="stats-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_corner.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6 lg:px-12 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Heading */}
            <div ref={headingRef} className="lg:col-span-4 space-y-4">
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl text-white font-black"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                STATS
              </h2>
              <p className="text-white/70 text-lg">
                Speed, tries, defensive stops—tracked across every match.
              </p>

              {/* Live Indicator */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <span className="w-2 h-2 bg-[#CFFF2E] rounded-full animate-pulse" />
                <span className="text-white/80 text-sm">
                  Live tournament stats
                </span>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div ref={cardsRef} className="lg:col-span-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="stat-card card-white p-6 lg:p-8"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-[#0B3D2E]" />
                      </div>
                      <div
                        className="text-4xl lg:text-5xl font-black text-[#0B3D2E]"
                        style={{ fontFamily: 'League Spartan, sans-serif' }}
                      >
                        {formatValue(animatedValues[index], index)}
                        <span className="text-[#CFFF2E]">{stat.suffix}</span>
                      </div>
                    </div>
                    <div className="text-[#0B3D2E]/60 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { label: 'Matches Played', value: '5' },
                  { label: 'Win Rate', value: '80%' },
                  { label: 'Top Scorer', value: 'T. Lau' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="stat-card bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                  >
                    <div
                      className="text-2xl font-bold text-[#CFFF2E]"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      {item.value}
                    </div>
                    <div className="text-white/60 text-sm">{item.label}</div>
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

export default StatsSection;
