import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Youtube, Facebook, Twitter, Send, Hash, Bell } from 'lucide-react';
import { fetchConfig, type Config } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const FanZone = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const socialCardRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configData = await fetchConfig();
        setConfig(configData);
      } catch (err) {
        console.error('Failed to load config:', err);
      }
    };

    loadConfig();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

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
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        socialCardRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.social-row',
        { y: '4vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, ease: 'none' },
        0.12
      );

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl.fromTo(
        headingRef.current,
        { x: 0, opacity: 1 },
        { x: '-25vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        socialCardRef.current,
        { x: 0, opacity: 1 },
        { x: '45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.fanzone-bg',
        { scale: 1 },
        { scale: 1.05, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    {
      icon: Instagram,
      name: 'Instagram',
      handle: config?.socialInstagram?.replace('@', '') || 'hk.tagrugby',
      url: config?.socialInstagram ? `https://instagram.com/${config.socialInstagram.replace('@', '')}` : 'https://instagram.com/hk.tagrugby',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    },
    {
      icon: Youtube,
      name: 'YouTube',
      handle: 'HK Tag Rugby',
      url: config?.socialYouTube || 'https://youtube.com/@hktagrugby',
      color: 'bg-red-600',
    },
    {
      icon: Facebook,
      name: 'Facebook',
      handle: 'HK Tag Rugby',
      url: config?.socialFacebook || 'https://facebook.com/hktagrugby',
      color: 'bg-blue-600',
    },
    {
      icon: Twitter,
      name: 'X',
      handle: config?.socialTwitter?.replace('@', '') || 'hk_tagrugby',
      url: config?.socialTwitter ? `https://twitter.com/${config.socialTwitter.replace('@', '')}` : 'https://twitter.com/hk_tagrugby',
      color: 'bg-black',
    },
  ].filter(link => link.url);

  return (
    <section
      ref={sectionRef}
      id="fanzone"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="fanzone-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero_pitch.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/65 md:bg-[#0B3D2E]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:gap-12 items-start">
          {/* Left: Heading + Newsletter */}
          <div ref={headingRef} className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-white font-black mb-2 sm:mb-4"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                FAN
                <br />
                <span className="text-[#CFFF2E]">ZONE</span>
              </h2>
              <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                Highlights, behind-the-scenes, and real-time updates. Tag us{' '}
                <span className="text-[#CFFF2E] font-semibold">#HKTR2026</span>
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFFF2E]" />
                <span className="text-white font-semibold text-sm sm:text-base">
                  Subscribe for Updates
                </span>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white text-sm placeholder:text-white/50 focus:outline-none focus:border-[#CFFF2E] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-[#CFFF2E] text-[#0B3D2E] rounded-lg sm:rounded-xl font-semibold hover:bg-[#d4ff4d] transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </form>

              {subscribed && (
                <p className="mt-2 sm:mt-3 text-[#CFFF2E] text-xs sm:text-sm">
                  Thanks for subscribing!
                </p>
              )}
            </div>

            {/* Hashtag */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFFF2E]" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm sm:text-base">#HKTR2026</div>
                <div className="text-white/60 text-xs sm:text-sm">
                  Share your moments
                </div>
              </div>
            </div>
          </div>

          {/* Right: Social Card */}
          <div ref={socialCardRef} className="lg:col-span-7">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3
                className="text-lg sm:text-xl font-bold text-[#0B3D2E] mb-4 sm:mb-6"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Follow the Journey
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-row flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0B3D2E]/5 rounded-lg sm:rounded-xl hover:bg-[#CFFF2E]/10 transition-colors group"
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${social.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <social.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#0B3D2E] font-semibold text-sm sm:text-base group-hover:text-[#0B3D2E]">
                        {social.name}
                      </div>
                      <div className="text-[#0B3D2E]/60 text-xs sm:text-sm truncate">
                        {social.handle}
                      </div>
                    </div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B3D2E]/10 flex items-center justify-center group-hover:bg-[#CFFF2E] transition-colors flex-shrink-0">
                      <Send className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B3D2E]" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Media Kit CTA */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#CFFF2E]/10 rounded-lg sm:rounded-xl border border-[#CFFF2E]/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <div className="text-[#0B3D2E] font-semibold text-sm sm:text-base">
                      Media Kit
                    </div>
                    <div className="text-[#0B3D2E]/60 text-xs sm:text-sm">
                      Download logos, photos, and brand assets
                    </div>
                  </div>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0B3D2E] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#0B3D2E]/90 transition-colors whitespace-nowrap">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FanZone;
