import { useEffect, useRef, useState } from 'react';
import { Clock, RefreshCw, Calendar, ChevronDown, Trophy, MapPin } from 'lucide-react';
import { fetchFixtures, fetchConfig, getDivisionStyle, type Fixture } from '../services/googleSheets';

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
    }, 60000); // Update every minute

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
    
    // Listen for filter events from navigation
    const handleFilterFixtures = (event: CustomEvent) => {
      const { date } = event.detail;
      if (date === '2026-04-11') {
        setActiveDay('Saturday');
      } else if (date === '2026-04-12') {
        setActiveDay('Sunday');
      } else if (date === 'all') {
        setSelectedDivision('All');
      }
    };
    
    window.addEventListener('filterFixtures', handleFilterFixtures as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('filterFixtures', handleFilterFixtures as EventListener);
    };
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

  // Generate PDF function
  const generateFixturesPDF = () => {
    if (informationPackUrl) {
      window.open(informationPackUrl, '_blank');
    }
  };

  // Format division name for display
  const formatDivisionName = (division: string): string => {
    if (!division) return '';
    return division.toUpperCase();
  };

  // Check if score should be displayed (only if > 0)
  const shouldShowScore = (score: number): boolean => {
    return !isNaN(score) && score > 0;
  };

  return (
    <section
      ref={sectionRef}
      id="fixtures"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-16"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_close.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-white font-black mb-2"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            Match Fixtures
          </h2>
          <p className="text-white/70 text-sm md:text-lg">
            Tag Asia Cup 2026 - Complete Schedule
          </p>
        </div>

        {/* Day Tabs & Division Filter */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 md:mb-8">
          {/* Day Tabs */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setActiveDay('Saturday')}
              className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-sm ${
                activeDay === 'Saturday'
                  ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
              Sat, Apr 11
            </button>
            <button
              onClick={() => setActiveDay('Sunday')}
              className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold transition-all text-xs sm:text-sm ${
                activeDay === 'Sunday'
                  ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
              Sun, Apr 12
            </button>
          </div>

          {/* Division Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="appearance-none px-4 py-2.5 sm:px-5 sm:py-3 bg-white/10 text-white rounded-full font-semibold text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer pr-10"
            >
              {divisions.map(div => (
                <option key={div} value={div} className="text-[#0B3D2E]">
                  {div === 'All' ? 'All Divisions' : formatDivisionName(div)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>

        {/* Match Cards - Centered Layout */}
        <div className="space-y-4 sm:space-y-5 max-h-[55vh] sm:max-h-[50vh] overflow-y-auto pr-1 sm:pr-2">
          {currentMatches.length > 0 ? (
            currentMatches.map((match) => {
              const divisionStyle = getDivisionStyle(match.division);
              const homeScoreVisible = shouldShowScore(match.homeScore);
              const awayScoreVisible = shouldShowScore(match.awayScore);
              
              return (
                <div
                  key={match.matchId}
                  className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:bg-white/15 transition-all"
                >
                  {/* Division Label - Colored, Centered */}
                  <div className="text-center mb-2 sm:mb-3">
                    <span 
                      className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold rounded-full tracking-wide"
                      style={{ 
                        backgroundColor: divisionStyle.color,
                        color: divisionStyle.textClass.includes('white') ? 'white' : '#0B3D2E'
                      }}
                    >
                      {formatDivisionName(match.division)}
                    </span>
                  </div>

                  {/* Match Content - Fully Centered */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-6">
                    
                    {/* Home Team - Full Name */}
                    <div className="flex-1 text-right min-w-0">
                      <p className="text-white font-semibold text-[11px] sm:text-sm md:text-base leading-tight break-words">
                        {match.homeTeam}
                      </p>
                    </div>

                    {/* Home Score (if visible) */}
                    {homeScoreVisible && (
                      <div className="flex-shrink-0">
                        <span className="text-[#CFFF2E] font-black text-xl sm:text-2xl md:text-3xl">
                          {match.homeScore}
                        </span>
                      </div>
                    )}

                    {/* VS Badge */}
                    <div className="flex-shrink-0 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 rounded-full">
                      <span className="text-white font-bold text-[10px] sm:text-xs tracking-wider">VS</span>
                    </div>

                    {/* Away Score (if visible) */}
                    {awayScoreVisible && (
                      <div className="flex-shrink-0">
                        <span className="text-[#CFFF2E] font-black text-xl sm:text-2xl md:text-3xl">
                          {match.awayScore}
                        </span>
                      </div>
                    )}

                    {/* Away Team - Full Name */}
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white font-semibold text-[11px] sm:text-sm md:text-base leading-tight break-words">
                        {match.awayTeam}
                      </p>
                    </div>
                  </div>

                  {/* Time & Field - Centered Below */}
                  <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#CFFF2E]" />
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {match.time}
                      </span>
                    </div>
                    <div className="w-px h-3 sm:h-4 bg-white/30" />
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#CFFF2E]" />
                      <span className="text-white/80 text-xs sm:text-sm">
                        {match.field}
                      </span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-white/30" />
                    <MatchCountdown date={match.date} time={match.time} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 sm:py-12">
              <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white/40 animate-spin mx-auto mb-4" />
              <p className="text-white/60 text-sm">
                {isRefreshing ? 'Loading fixtures...' : 'No fixtures found for this filter'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 sm:mt-8">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs sm:text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            <button
              onClick={generateFixturesPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] text-xs sm:text-sm font-semibold transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">View All</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 rounded-xl border border-red-500/30">
            <p className="text-red-300 text-xs sm:text-sm">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FixturesSection;
