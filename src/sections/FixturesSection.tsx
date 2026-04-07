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
      
      setSaturdayMatches(fixturesData.filter((m: Fixture) => m.day === 'Saturday'));
      setSundayMatches(fixturesData.filter((m: Fixture) => m.day === 'Sunday'));
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

  // Get unique divisions from all matches
  const allMatches = [...saturdayMatches, ...sundayMatches];
  const divisions = ['All', ...Array.from(new Set(allMatches.map(m => m.division).filter(Boolean)))];
  
  // Filter matches by division
  const filteredSaturday = selectedDivision === 'All' 
    ? saturdayMatches 
    : saturdayMatches.filter(m => m.division === selectedDivision);
    
  const filteredSunday = selectedDivision === 'All' 
    ? sundayMatches 
    : sundayMatches.filter(m => m.division === selectedDivision);

  const currentMatches = activeDay === 'Saturday' ? filteredSaturday : filteredSunday;

  const formatTime = (time: string) => {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="fixtures"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0B3D2E]">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/pitch_midfield.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B3D2E] via-[#0B3D2E]/95 to-[#0B3D2E]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#CFFF2E]" />
            <span className="text-[#CFFF2E] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Match Fixtures
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl text-white font-black mb-2"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            TAG ASIA CUP <span className="text-[#CFFF2E]">2026</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            Complete Schedule - J-Green Sakai, Osaka
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          {(['Saturday', 'Sunday'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm transition-all ${
                activeDay === day
                  ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{day}</span>
                <span className="text-xs opacity-60">
                  ({day === 'Saturday' ? filteredSaturday.length : filteredSunday.length})
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Division Filter */}
        {divisions.length > 1 && (
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none bg-white/10 text-white px-4 sm:px-6 py-2 sm:py-3 pr-10 sm:pr-12 rounded-full font-semibold text-sm cursor-pointer hover:bg-white/20 transition-colors border border-white/10"
              >
                {divisions.map((division) => (
                  <option key={division} value={division} className="bg-[#0B3D2E]">
                    {division === 'All' ? 'All Divisions' : division}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Info Pack Link */}
        {informationPackUrl && (
          <div className="text-center mb-4 sm:mb-6">
            <a
              href={informationPackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#CFFF2E] hover:text-white transition-colors text-sm"
            >
              <MapPin className="w-4 h-4" />
              Download Tournament Information Pack
            </a>
          </div>
        )}

        {/* Matches List */}
        <div className="space-y-2 sm:space-y-3">
          {error ? (
            <div className="text-center py-8 bg-white/5 rounded-xl">
              <p className="text-red-400 mb-2">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-[#CFFF2E] text-[#0B3D2E] rounded-full font-semibold text-sm"
              >
                Retry
              </button>
            </div>
          ) : currentMatches.length > 0 ? (
            currentMatches.map((match, index) => {
              const divisionStyle = getDivisionStyle(match.division);
              return (
                <div
                  key={match.matchId || index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {/* Time & Countdown */}
                    <div className="flex items-center gap-3 sm:gap-4 sm:w-32 shrink-0">
                      <div className="text-center">
                        <p className="text-[#CFFF2E] font-bold text-base sm:text-lg">
                          {formatTime(match.time)}
                        </p>
                        <MatchCountdown date={match.date} time={match.time} />
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-semibold text-sm sm:text-base truncate">
                          {match.homeTeam}
                        </span>
                        <span className="text-white/40 text-xs sm:text-sm">vs</span>
                        <span className="text-white font-semibold text-sm sm:text-base truncate text-right">
                          {match.awayTeam}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${divisionStyle.bgClass} ${divisionStyle.textClass}`}>
                          {match.division}
                        </span>
                        <span className="text-white/40 text-[10px] sm:text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {match.field}
                        </span>
                      </div>
                    </div>

                    {/* Score (if available) */}
                    {match.status === 'FINAL' && (
                      <div className="text-right shrink-0">
                        <p className="text-[#CFFF2E] font-bold text-lg sm:text-xl">
                          {match.homeScore} - {match.awayScore}
                        </p>
                        <p className="text-white/40 text-xs">FINAL</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 bg-white/5 rounded-xl">
              <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No matches scheduled for this day.</p>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 text-white/40 text-xs sm:text-sm">
          <RefreshCw 
            className={`w-4 h-4 cursor-pointer hover:text-[#CFFF2E] transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={loadData}
          />
          <span>
            Updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
