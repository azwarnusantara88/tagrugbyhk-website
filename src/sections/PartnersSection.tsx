import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Handshake } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PartnersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.partner-card');
      
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { y: '4vh', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const partners = [
    { name: 'International Tag Federation', tier: 'Title Partner' },
    { name: 'Japan Tag Football Association', tier: 'Host Partner' },
    { name: 'Hong Kong Rugby Union', tier: 'Supporting Partner' },
    { name: 'J-Green Sakai', tier: 'Venue Partner' },
    { name: 'Sports Hong Kong', tier: 'Media Partner' },
    { name: 'Active Zone', tier: 'Equipment Partner' },
    { name: 'Travel Osaka', tier: 'Travel Partner' },
    { name: 'FitLife HK', tier: 'Wellness Partner' },
  ];

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="relative w-full py-12 sm:py-16 lg:py-24 bg-[#F6F7F6]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#CFFF2E]/20 rounded-full mb-4 sm:mb-6">
            <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B3D2E]" />
            <span className="text-[#0B3D2E] text-xs sm:text-sm font-medium">
              Our Supporters
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-[#0B3D2E] font-black mb-2 sm:mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            PARTNERS
          </h2>

          <p className="text-[#0B3D2E]/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Thanks to the organizations backing Hong Kong's tag rugby journey
            to the Tag Asia Cup 2026.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="partner-card bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#0B3D2E]/5"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[#0B3D2E]/5 flex items-center justify-center mb-2 sm:mb-4">
                <span
                  className="text-xl sm:text-2xl font-black text-[#0B3D2E]"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-[#0B3D2E] font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2">
                {partner.name}
              </h3>
              <p className="text-[#0B3D2E]/60 text-[10px] sm:text-xs">{partner.tier}</p>
            </div>
          ))}
        </div>

        {/* Become a Partner CTA */}
        <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-[#0B3D2E] rounded-xl sm:rounded-2xl">
            <div className="text-white text-center sm:text-left">
              <div className="font-semibold text-sm sm:text-base">Want to support HKTR?</div>
              <div className="text-white/60 text-xs sm:text-sm">
                Partner with us for the Tag Asia Cup 2026
              </div>
            </div>
            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-[#CFFF2E] text-[#0B3D2E] rounded-lg sm:rounded-xl font-semibold hover:bg-[#d4ff4d] transition-colors whitespace-nowrap text-sm">
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
