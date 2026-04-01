import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, RefreshCw, Calendar, ChevronDown, Trophy } from 'lucide-react';
import { fetchFixtures, fetchConfig, getDivisionStyle, getAbbreviatedDivision, type Fixture } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const FixturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const [activeDay, setActiveDay] = useState<'Saturday' | 'Sunday'>('Saturday');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [saturdayMatches, setSaturdayMatches] = useState<Fixture[]>([]);
  const [sundayMatches, setSundayMatches] = useState<Fixture[]>([]);
  const [informationPackUrl, setInformationPackUrl] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch fixtures from Google Sheets
  const loadData = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const [fixturesData, configData] = await Promise.all([
        fetchFixtures(),
        fetchConfig()
      ]);
      
      setSaturdayMatches(fixturesData.filter(m => m.day === 'Saturday'));
      setSundayMatches(fixturesData.filter(m => m.day === 'Sunday'));
      setInformationPackUrl(configData.informationPackUrl);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Failed to fetch fixtures:', err);
      setError('Failed to load fixtures. Please check if the Google Sheet is public.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

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
        { y: '-30vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      const cards = cardsRef.current?.querySelectorAll('.fixture-card');
      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { y: '20vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.05 + index * 0.02
        );
      });

      // EXIT (70-100%)
      scrollTl.fromTo(
        headingRef.current,
        { y: 0, opacity: 1 },
        { y: '-20vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '20vh', opacity: 0, ease: 'power2.in' },
          0.72 + index * 0.02
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

  // Get unique divisions from all matches
  const getAllDivisions = (): string[] => {
    const allMatches = [...saturdayMatches, ...sundayMatches];
    const divisions = new Set(allMatches.map(m => m.division).filter(Boolean));
    return ['All', ...Array.from(divisions)];
  };

  // Filter matches by division
  const filterMatches = (matches: Fixture[]): Fixture[] => {
    if (selectedDivision === 'All') return matches;
    return matches.filter(m => m.division === selectedDivision);
  };

  const currentMatches = filterMatches(activeDay === 'Saturday' ? saturdayMatches : sundayMatches);
  const divisions = getAllDivisions();

  // Generate PDF function (placeholder - would need PDF library)
  const generateFixturesPDF = () => {
    if (informationPackUrl) {
      window.open(informationPackUrl, '_blank');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="fixtures"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="fixtures-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_close.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/70 md:bg-[#0B3D2E]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div ref={headingRef} className="w-full">
          
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <h2
              className="text-2xl sm:text-3xl md:text-5xl text-white font-black mb-1 md:mb-2"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              Match Fixtures
            </h2>
            <p className="text-white/70 text-sm md:text-lg">
              Tag Asia Cup 2026 - Complete Schedule
            </p>
          </div>

          {/* Day Tabs & Division Filter */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 md:mb-6">
            {/* Day Tabs */}
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setActiveDay('Saturday')}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-sm ${
                  activeDay === 'Saturday'
                    ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                Sat, Apr 11
              </button>
              <button
                onClick={() => setActiveDay('Sunday')}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-sm ${
                  activeDay === 'Sunday'
                    ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                Sun, Apr 12
              </button>
            </div>

            {/* Division Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none px-3 py-2 sm:px-4 sm:py-3 bg-white/10 text-white rounded-full font-semibold text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer pr-8"
              >
                {divisions.map(div => (
                  <option key={div} value={div} className="text-[#0B3D2E]">
                    {div === 'All' ? 'All Divisions' : getAbbreviatedDivision(div)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white pointer-events-none" />
            </div>
          </div>

          {/* Match Cards */}
          <div ref={cardsRef} className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[45vh] overflow-y-auto pr-1 sm:pr-2">
            {currentMatches.length > 0 ? (
              currentMatches.map((match) => {
                const divisionStyle = getDivisionStyle(match.division);
                const hasScores = match.homeScore >= 0 && match.awayScore >= 0;
                
                return (
                  <div
                    key={match.matchId}
                    className="fixture-card bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/15 transition-colors"
                  >
                    {/* Layout: Time/Field | Team A | VS/Score | Team B | Division */}
                    <div className="flex items-center gap-2 sm:gap-4">
                      {/* Time & Field */}
                      <div className="flex-shrink-0 w-14 sm:w-20">
                        <div className="text-[#CFFF2E] font-bold text-sm sm:text-base">
                          {match.time}
                        </div>
                        <div className="text-white/50 text-[10px] sm:text-xs">
                          {match.field}
                        </div>
                      </div>

                      {/* Teams with centered VS/Score */}
                      <div className="flex-1 flex items-center justify-center min-w-0">
                        <div className="flex items-center w-full max-w-md">
                          {/* Team A - Right aligned */}
                          <div className="flex-1 text-right pr-2 sm:pr-4 min-w-0">
                            <span className="text-white font-semibold text-xs sm:text-sm truncate block">
                              {match.homeTeam}
                            </span>
                          </div>
                          
                          {/* VS/Score - Centered, fixed width */}
                          <div className="flex-shrink-0 w-12 sm:w-16 text-center">
                            {hasScores ? (
                              <div className="flex items-center justify-center gap-1 px-1 sm:px-2 py-0.5 bg-[#0B3D2E]/50 rounded">
                                <span className="text-[#CFFF2E] font-bold text-xs sm:text-sm">{match.homeScore}</span>
                                <span className="text-white/40 text-xs">-</span>
                                <span className="text-[#CFFF2E] font-bold text-xs sm:text-sm">{match.awayScore}</span>
                              </div>
                            ) : (
                              <span className="text-white/60 font-bold text-xs sm:text-sm">VS</span>
                            )}
                          </div>
                          
                          {/* Team B - Left aligned */}
                          <div className="flex-1 text-left pl-2 sm:pl-4 min-w-0">
                            <span className="text-white font-semibold text-xs sm:text-sm truncate block">
                              {match.awayTeam}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Division Badge */}
                      <div className="flex-shrink-0">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold rounded-full ${divisionStyle.bgClass} ${divisionStyle.textClass}`}>
                          {getAbbreviatedDivision(match.division)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 sm:py-8">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white/40 animate-spin mx-auto mb-3 sm:mb-4" />
                <p className="text-white/60 text-sm">
                  {isRefreshing ? 'Loading fixtures...' : 'No fixtures found for this filter'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 sm:mt-6">
            {/* Last Updated */}
            <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs sm:text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <button
                onClick={generateFixturesPDF}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] text-xs sm:text-sm font-semibold transition-colors"
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">View All</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/20 rounded-lg sm:rounded-xl border border-red-500/30">
              <p className="text-red-300 text-xs sm:text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
