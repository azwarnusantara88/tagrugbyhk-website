import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, ExternalLink, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { fetchConfig, type Config } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const CoverSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const configData = await fetchConfig();
        setConfig(configData);
      } catch (err) {
        console.error('Failed to load config:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // ENTRANCE: Content slides up and fades in
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-[#0B3D2E]"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </section>
    );
  }

  const tournamentName = config?.tournamentName || 'Tag Asia Cup 2026';
  const eventDate = config?.eventDate || 'April 11-12, 2026';
  const location = config?.location || 'J-Green Sakai, Osaka';

  return (
    <section
      ref={sectionRef}
      id="cover"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero_pitch.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D2E]/70 via-[#0B3D2E]/50 to-[#0B3D2E]/90" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center"
      >
        {/* Tournament Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E]/20 backdrop-blur-sm rounded-full mb-6">
          <span className="w-2 h-2 bg-[#CFFF2E] rounded-full animate-pulse" />
          <span className="text-[#CFFF2E] text-sm font-semibold uppercase tracking-wider">
            Official Tournament
          </span>
        </div>

        {/* Tournament Name */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-black mb-4 leading-tight"
          style={{ fontFamily: 'League Spartan, sans-serif' }}
        >
          {tournamentName.split(' ').slice(0, -1).join(' ')}
          <br />
          <span className="text-[#CFFF2E]">{tournamentName.split(' ').pop()}</span>
        </h1>

        {/* Event Details */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="w-5 h-5 text-[#CFFF2E]" />
            <span className="text-lg">{eventDate}</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-5 h-5 text-[#CFFF2E]" />
            <span className="text-lg">{location}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {config?.registrationOpen && (
            <a
              href="#register"
              className="px-8 py-4 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-bold text-lg transition-all transform hover:scale-105"
            >
              Register Now
            </a>
          )}
          {config?.informationPack && (
            <a
              href={config.informationPack}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              Information Pack
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
          {config?.socialInstagram && (
            <a
              href={`https://instagram.com/${config.socialInstagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#CFFF2E] flex items-center justify-center transition-all group"
            >
              <Instagram className="w-5 h-5 text-white group-hover:text-[#0B3D2E]" />
            </a>
          )}
          {config?.socialFacebook && (
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#CFFF2E] flex items-center justify-center transition-all group"
            >
              <Facebook className="w-5 h-5 text-white group-hover:text-[#0B3D2E]" />
            </a>
          )}
          {config?.socialYouTube && (
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#CFFF2E] flex items-center justify-center transition-all group"
            >
              <Youtube className="w-5 h-5 text-white group-hover:text-[#0B3D2E]" />
            </a>
          )}
          {config?.socialTwitter && (
            <a
              href={`https://twitter.com/${config.socialTwitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#CFFF2E] flex items-center justify-center transition-all group"
            >
              <Twitter className="w-5 h-5 text-white group-hover:text-[#0B3D2E]" />
            </a>
          )}
        </div>

        {/* Contact Info */}
        {(config?.contactEmail || config?.contactPhone) && (
          <div className="mt-8 text-white/60 text-sm">
            {config.contactEmail && <span>{config.contactEmail}</span>}
            {config.contactEmail && config.contactPhone && <span className="mx-2">|</span>}
            {config.contactPhone && <span>{config.contactPhone}</span>}
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#CFFF2E] rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default CoverSection;
