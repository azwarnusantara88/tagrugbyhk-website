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
      className="section-flowing py-20 lg:py-32 bg-[#F6F7F6]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E]/20 rounded-full mb-6">
            <Handshake className="w-5 h-5 text-[#0B3D2E]" />
            <span className="text-[#0B3D2E] text-sm font-medium">
              Our Supporters
            </span>
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl text-[#0B3D2E] font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            PARTNERS
          </h2>

          <p className="text-[#0B3D2E]/70 text-lg max-w-2xl mx-auto">
            Thanks to the organizations backing Hong Kong's tag rugby journey
            to the Tag Asia Cup 2026.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="partner-card bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#0B3D2E]/5"
            >
              <div className="w-16 h-16 rounded-xl bg-[#0B3D2E]/5 flex items-center justify-center mb-4">
                <span
                  className="text-2xl font-black text-[#0B3D2E]"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-[#0B3D2E] font-semibold mb-1">
                {partner.name}
              </h3>
              <p className="text-[#0B3D2E]/60 text-sm">{partner.tier}</p>
            </div>
          ))}
        </div>

        {/* Become a Partner CTA */}
        <div className="mt-12 lg:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-[#0B3D2E] rounded-2xl">
            <div className="text-white">
              <div className="font-semibold">Want to support HKTR?</div>
              <div className="text-white/60 text-sm">
                Partner with us for the Tag Asia Cup 2026
              </div>
            </div>
            <button className="px-6 py-3 bg-[#CFFF2E] text-[#0B3D2E] rounded-xl font-semibold hover:bg-[#d4ff4d] transition-colors whitespace-nowrap">
              Become a Partner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
