import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Trophy, Users } from 'lucide-react';

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
    days: 15,
    hours: 4,
    minutes: 36,
    seconds: 15,
  });

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2026-04-11T09:00:00+09:00');
    
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
  }, []);

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

  // Scroll-driven exit animation
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
          onLeaveBack: () => {
            gsap.set('.hero-logo, .hero-title, .hero-subtitle, .hero-countdown, .hero-stats, .hero-cta', { 
              y: 0, opacity: 1 
            });
            gsap.set('.hero-bg', { scale: 1 });
          },
        },
      });

      // EXIT (70-100%): Elements exit
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

  const scrollToFixtures = () => {
    const element = document.querySelector('#fixtures');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned z-10"
    >
      {/* Background Image */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero_pitch.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/65" />
      </div>

      {/* Content - Centered Layout */}
      <div className="hero-content relative z-10 h-full flex flex-col items-center justify-center px-6 pt-20">
        {/* Tag Asia Cup Logo */}
        <div className="hero-logo mb-6">
          <img 
            src="/logo.png" 
            alt="Tag Asia Cup 2026" 
            className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Title */}
        <div className="hero-title text-center mb-4">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-black"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            TAG ASIA CUP
          </h1>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#CFFF2E] font-black"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            2026
          </h1>
        </div>

        {/* Subtitle */}
        <div className="hero-subtitle text-center mb-8">
          <p className="text-white/90 text-lg md:text-xl mb-2">
            Hong Kong Tag Rugby's first ITF-sanctioned tournament.
          </p>
          <p className="text-[#CFFF2E] text-lg md:text-xl">
            J-Green Sakai, Osaka.
          </p>
          <p className="text-white/70 text-lg">
            April 11-12, 2026
          </p>
        </div>

        {/* Countdown with Fixed Width Number Boxes */}
        <div className="hero-countdown mb-8">
          <div className="text-center">
            <p className="text-white/60 text-sm uppercase tracking-wider mb-4">
              Tournament Starts In
            </p>
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {[
                { value: timeLeft.days, label: 'DAYS' },
                { value: timeLeft.hours, label: 'HOURS' },
                { value: timeLeft.minutes, label: 'MINS' },
                { value: timeLeft.seconds, label: 'SECS' },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Fixed width number box with transparent background */}
                  <div 
                    className="w-14 h-16 md:w-20 md:h-24 lg:w-24 lg:h-28 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <span
                      className="text-2xl md:text-4xl lg:text-5xl font-black text-white tabular-nums"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 uppercase mt-2 tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
            {/* Fading Kickoff text */}
            <p className="text-[#CFFF2E]/60 text-sm mt-4 animate-pulse">
              Kickoff
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="hero-stats flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          {[
            { icon: Users, value: '16', label: 'Teams' },
            { icon: Trophy, value: '29', label: 'Matches' },
            { icon: Calendar, value: '4', label: 'Divisions' },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full"
            >
              <stat.icon className="w-5 h-5 text-[#CFFF2E]" />
              <div className="flex items-center gap-1">
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  {stat.value}
                </span>
                <span className="text-white/70 text-sm">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={scrollToFixtures}
          className="hero-cta btn-primary inline-flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          View Fixtures
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
