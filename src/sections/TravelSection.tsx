import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Hotel, Bus, MapPin, Download, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TravelSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null);

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
        '.travel-text',
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        mapCardRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.map-chip',
        { y: '3vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, ease: 'none' },
        0.14
      );

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl.fromTo(
        '.travel-text',
        { x: 0, opacity: 1 },
        { x: '-30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        mapCardRef.current,
        { x: 0, opacity: 1 },
        { x: '45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.travel-bg',
        { scale: 1 },
        { scale: 1.04, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const travelInfo = [
    {
      icon: Plane,
      title: 'Flight',
      description: 'Fly into KIX (Kansai International)',
    },
    {
      icon: Bus,
      title: 'Transport',
      description: '45 mins to venue. Team bus provided.',
    },
    {
      icon: Hotel,
      title: 'Accommodation',
      description: 'Hotels near Sakai or Namba',
    },
  ];

  const locationChips = [
    { icon: MapPin, label: 'J-Green Sakai', color: 'bg-[#CFFF2E]' },
    { icon: Hotel, label: 'Hotel Sakai', color: 'bg-blue-100' },
    { icon: Plane, label: 'KIX Airport', color: 'bg-orange-100' },
  ];

  return (
    <section
      ref={sectionRef}
      id="travel"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background */}
      <div className="travel-bg absolute inset-0 bg-[#F6F7F6]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(/pitch_midfield.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div ref={textGroupRef} className="space-y-4 sm:space-y-6">
            <h2
              className="travel-text text-3xl sm:text-4xl lg:text-5xl text-[#0B3D2E] font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              TRAVEL
              <br />
              <span className="text-[#0B3D2E]/60">& STAY</span>
            </h2>

            <p className="travel-text text-[#0B3D2E]/70 text-sm sm:text-base lg:text-lg leading-relaxed">
              Fly into KIX. 45 mins to venue. Recommended hotels near Sakai
              or Namba. Team transport provided on match days.
            </p>

            {/* Travel Info Cards */}
            <div className="space-y-2 sm:space-y-3">
              {travelInfo.map((info, index) => (
                <div
                  key={index}
                  className="travel-text flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B3D2E]" />
                  </div>
                  <div>
                    <div className="text-[#0B3D2E] font-semibold text-sm sm:text-base">
                      {info.title}
                    </div>
                    <div className="text-[#0B3D2E]/60 text-xs sm:text-sm">
                      {info.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="travel-text inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-[#0B3D2E] text-white rounded-full font-semibold hover:bg-[#0B3D2E]/90 transition-colors text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download Itinerary
            </button>
          </div>

          {/* Right: Map Card */}
          <div ref={mapCardRef} className="card-white overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <h3
                className="text-lg sm:text-xl font-bold text-[#0B3D2E] mb-3 sm:mb-4"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Venue Map
              </h3>

              {/* Map Image */}
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                <img
                  src="/map_sakai.jpg"
                  alt="Sakai Map"
                  className="w-full h-40 sm:h-56 lg:h-64 object-cover"
                />
              </div>

              {/* Location Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {locationChips.map((chip, index) => (
                  <div
                    key={index}
                    className={`map-chip inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 ${chip.color} rounded-full`}
                  >
                    <chip.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B3D2E]" />
                    <span className="text-[#0B3D2E] text-[10px] sm:text-sm font-medium">
                      {chip.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Get Directions Link */}
              <a
                href="https://maps.google.com/?q=J-Green+Sakai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 text-[#0B3D2E] font-medium hover:text-[#CFFF2E] transition-colors text-sm"
              >
                Get Directions
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelSection;
