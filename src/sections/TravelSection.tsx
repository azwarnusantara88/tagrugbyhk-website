import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Hotel, Bus, MapPin, Download, ArrowRight } from 'lucide-react';
import { fetchConfig, type Config } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const TravelSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<Config | null>(null);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.travel-content',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.travel-card',
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
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
    { icon: MapPin, label: config?.location?.split(',')[0] || 'J-Green Sakai', color: 'bg-[#CFFF2E]' },
    { icon: Hotel, label: 'Hotel Sakai', color: 'bg-blue-100' },
    { icon: Plane, label: 'KIX Airport', color: 'bg-orange-100' },
  ];

  return (
    <section
      ref={sectionRef}
      id="travel"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 md:py-24"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#F6F7F6]">
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
          <div className="travel-content space-y-4 sm:space-y-6">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-[#0B3D2E] font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              TRAVEL
              <br />
              <span className="text-[#0B3D2E]/60">& STAY</span>
            </h2>

            <p className="text-[#0B3D2E]/70 text-sm sm:text-base lg:text-lg leading-relaxed">
              Fly into KIX. 45 mins to venue. Recommended hotels near Sakai
              or Namba. Team transport provided on match days.
            </p>

            {/* Travel Info Cards */}
            <div className="space-y-2 sm:space-y-3">
              {travelInfo.map((info, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-[#CFFF2E]/10"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <info.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B3D2E]" />
                  </div>
                  <div>
                    <div className="text-[#0B3D2E] font-semibold text-sm sm:text-base transition-colors duration-300 group-hover:text-[#0B3D2E]">
                      {info.title}
                    </div>
                    <div className="text-[#0B3D2E]/60 text-xs sm:text-sm">
                      {info.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {config?.informationPack && (
              <a
                href={config.informationPack}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-[#0B3D2E] text-white rounded-full font-semibold transition-all duration-300 hover:bg-[#0B3D2E]/90 hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                Download Itinerary
              </a>
            )}
          </div>

          {/* Right: Map Card */}
          <div className="travel-card bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
            <div className="p-4 sm:p-6 lg:p-8">
              <h3
                className="text-lg sm:text-xl font-bold text-[#0B3D2E] mb-3 sm:mb-4"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Venue Map
              </h3>

              {/* Map Image */}
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 group">
                <img
                  src="/map_sakai.jpg"
                  alt="Sakai Map"
                  className="w-full h-40 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Location Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {locationChips.map((chip, index) => (
                  <div
                    key={index}
                    className={`group/chip inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 ${chip.color} rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-md`}
                  >
                    <chip.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B3D2E] transition-transform duration-300 group-hover/chip:scale-110" />
                    <span className="text-[#0B3D2E] text-[10px] sm:text-sm font-medium">
                      {chip.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Get Directions Link */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(config?.location || 'J-Green Sakai')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 text-[#0B3D2E] font-medium transition-all duration-300 hover:text-[#CFFF2E] hover:gap-3 text-sm"
              >
                Get Directions
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelSection;
