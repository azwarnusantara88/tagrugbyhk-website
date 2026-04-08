import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Calendar, MapPin, RefreshCw, Trophy, ChevronDown } from 'lucide-react';
import { fetchFixtures, fetchConfig, getDivisionStyle, type Fixture, type Config } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

// Countdown timer hook
const useCountdown = (targetDate: string, targetTime: string) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const matchDateTime = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const diff = matchDateTime.getTime() - now.getTime();

      if (diff <= 0) {
        return 'LIVE';
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        return `${days}d ${hours}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return timeLeft;
};

// Individual match countdown component
const MatchCountdown = ({ date, time }: { date: string; time: string }) => {
  const countdown = useCountdown(date, time);
  return (
    <span className="text-[10px] sm:text-xs text-white/60 font-medium">
      {countdown === 'LIVE' ? (
        <span className="text-red-400 animate-pulse">● LIVE</span>
      ) : (
        `in ${countdown}`
      )}
    </span>
  );
};

const FixturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeDay, setActiveDay] = useState<'Saturday' | 'Sunday'>('Saturday');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [fixturesData, configData] = await Promise.all([
        fetchFixtures(),
        fetchConfig(),
      ]);
      setFixtures(fixturesData);
      setConfig(configData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch fixtures:', err);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
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
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
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
  }, [isLoading]);

  // Get unique divisions
  const divisions = ['All', ...Array.from(new Set(fixtures.map(f => f.division).filter(Boolean)))];

  // Filter fixtures
  const filteredFixtures = fixtures.filter((f) => {
    const dayMatch = f.day === activeDay;
    const divisionMatch = selectedDivision === 'All' || f.division === selectedDivision;
    return dayMatch && divisionMatch;
  });

  const formatDivisionName = (division: string): string => {
    return division?.toUpperCase() || '';
  };

  if (isLoading) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-[#0B3D2E] py-20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading fixtures...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="fixtures"
      className="relative w-full min-h-screen bg-[#0B3D2E] py-20 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E]/20 rounded-full mb-4">
            <Trophy className="w-5 h-5 text-[#CFFF2E]" />
            <span className="text-[#CFFF2E] text-sm font-semibold uppercase tracking-wider">
              Match Schedule
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            MATCH <span className="text-[#CFFF2E]">FIXTURES</span>
          </h2>
          <p className="text-white/60 text-lg">
            Complete tournament schedule
          </p>
        </div>

        {/* Filters */}
        <div ref={contentRef} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            {/* Day Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDay('Saturday')}
                className={`px-6 py-3 rounded-full font-semibold transition-all text-sm ${
                  activeDay === 'Saturday'
                    ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Saturday, Apr 11
              </button>
              <button
                onClick={() => setActiveDay('Sunday')}
                className={`px-6 py-3 rounded-full font-semibold transition-all text-sm ${
                  activeDay === 'Sunday'
                    ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Sunday, Apr 12
              </button>
            </div>

            {/* Division Filter */}
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none px-5 py-3 bg-white/10 text-white rounded-full font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer pr-10"
              >
                {divisions.map((div) => (
                  <option key={div} value={div} className="text-[#0B3D2E]">
                    {div === 'All' ? 'All Divisions' : div}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Fixtures List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {filteredFixtures.length > 0 ? (
            filteredFixtures.map((fixture) => {
              const divisionStyle = getDivisionStyle(fixture.division);
              const hasScores = fixture.homeScore > 0 || fixture.awayScore > 0;

              return (
                <div
                  key={fixture.matchId}
                  className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 transition-all"
                >
                  {/* Division Badge */}
                  <div className="flex justify-center mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: divisionStyle.color,
                        color: divisionStyle.textClass.includes('white') ? 'white' : '#0B3D2E',
                      }}
                    >
                      {formatDivisionName(fixture.division)}
                    </span>
                  </div>

                  {/* Teams & Score */}
                  <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
                    {/* Home Team */}
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {fixture.homeTeam}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2 px-3">
                      {hasScores ? (
                        <>
                          <span className="text-[#CFFF2E] font-black text-2xl sm:text-3xl">
                            {fixture.homeScore}
                          </span>
                          <span className="text-white/40 font-bold">-</span>
                          <span className="text-[#CFFF2E] font-black text-2xl sm:text-3xl">
                            {fixture.awayScore}
                          </span>
                        </>
                      ) : (
                        <div className="px-3 py-1 bg-white/10 rounded-full">
                          <span className="text-white/60 text-xs font-bold">VS</span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold text-sm sm:text-base">
                        {fixture.awayTeam}
                      </p>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-white/60 text-sm">
                      <Clock className="w-4 h-4 text-[#CFFF2E]" />
                      <span>{fixture.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60 text-sm">
                      <MapPin className="w-4 h-4 text-[#CFFF2E]" />
                      <span>{fixture.field}</span>
                    </div>
                    <MatchCountdown date={fixture.date} time={fixture.time} />
                  </div>

                  {/* Notes */}
                  {fixture.notes && (
                    <div className="mt-3 text-center">
                      <span className="text-[#CFFF2E] text-xs">{fixture.notes}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No fixtures found for this filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Clock className="w-4 h-4" />
            <span>Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {config?.informationPack && (
              <a
                href={config.informationPack}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] text-sm font-semibold transition-colors"
              >
                <Trophy className="w-4 h-4" />
                Full Schedule
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
