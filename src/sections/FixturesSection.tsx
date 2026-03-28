import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, MapPin, RefreshCw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Match {
  id: string;
  time: string;
  team1: string;
  team2: string;
  pool: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: string;
}

const FixturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [matches] = useState<Match[]>([
    {
      id: '1',
      time: '09:00',
      team1: 'Hong Kong',
      team2: 'Japan',
      pool: 'Pool A',
      venue: 'Field 1',
      status: 'upcoming',
    },
    {
      id: '2',
      time: '10:00',
      team1: 'Philippines',
      team2: 'Thailand',
      pool: 'Pool B',
      venue: 'Field 2',
      status: 'upcoming',
    },
    {
      id: '3',
      time: '11:15',
      team1: 'Hong Kong',
      team2: 'Singapore',
      pool: 'Pool A',
      venue: 'Field 1',
      status: 'upcoming',
    },
  ]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Google Sheets sync simulation
  const refreshFixtures = async () => {
    setIsRefreshing(true);
    
    // Simulate API call to Google Sheets
    // In production, replace with actual Google Sheets API endpoint
    try {
      // const response = await fetch('YOUR_GOOGLE_SHEETS_API_URL');
      // const data = await response.json();
      // setMatches(data);
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch fixtures:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(refreshFixtures, 60000);
    return () => clearInterval(interval);
  }, []);

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
        headingRef.current,
        { x: '-35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      const cards = cardsRef.current?.querySelectorAll('.match-card');
      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          index * 0.08
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
          { x: 0, opacity: 1 },
          { x: '45vw', opacity: 0, ease: 'power2.in', stagger: 0.03 },
          0.7 + index * 0.03
        );
      });

      scrollTl.fromTo(
        '.fixtures-bg',
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
      id="fixtures"
      className="section-pinned z-30"
    >
      {/* Background Image */}
      <div
        className="fixtures-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_close.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/55" />
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
                FIXTURES
              </h2>
              <p className="text-white/70 text-lg">
                Kick-off times in JST. Updates refresh every 60 seconds.
              </p>

              {/* Last Updated */}
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={refreshFixtures}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
              </button>

              {/* Google Sheets Note */}
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/60 text-sm">
                  <strong className="text-[#CFFF2E]">Live Sync:</strong> Fixtures
                  are synced with Google Sheets for real-time updates.
                </p>
              </div>
            </div>

            {/* Right: Match Cards */}
            <div ref={cardsRef} className="lg:col-span-8 space-y-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="match-card card-white p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Time */}
                  <div className="flex items-center gap-3 sm:w-24 flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#0B3D2E]/40" />
                    <span
                      className="text-xl font-bold text-[#0B3D2E]"
                      style={{ fontFamily: 'League Spartan, sans-serif' }}
                    >
                      {match.time}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-[#0B3D2E] font-semibold">
                      {match.team1}
                    </span>
                    <span className="text-[#0B3D2E]/40 font-bold">vs</span>
                    <span className="text-[#0B3D2E] font-semibold">
                      {match.team2}
                    </span>
                  </div>

                  {/* Pool Tag */}
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#CFFF2E] text-[#0B3D2E] text-sm font-semibold rounded-full">
                      {match.pool}
                    </span>
                    <div className="flex items-center gap-1 text-[#0B3D2E]/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      {match.venue}
                    </div>
                  </div>

                  {/* Status */}
                  {match.status === 'live' && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-500 text-sm font-semibold">
                        LIVE
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* View All Button */}
              <button className="w-full py-4 border-2 border-dashed border-white/30 rounded-[28px] text-white/60 hover:text-white hover:border-white/50 transition-colors">
                View All Fixtures
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
