import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, RefreshCw, Calendar, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Match {
  matchId: string;
  date: string;
  day: string;
  time: string;
  field: string;
  homeTeam: string;
  awayTeam: string;
  division: string;
  round: string;
  status: string;
  notes: string;
}

const SHEET_ID = '1T3Zmy8oXY8FtkJsz6XApqr_PhVNSgC1yFAT2N_BkYDU';
const SHEET_NAME = 'FIXTURES';

const FixturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState<'Saturday' | 'Sunday'>('Saturday');
  const [saturdayMatches, setSaturdayMatches] = useState<Match[]>([]);
  const [sundayMatches, setSundayMatches] = useState<Match[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch fixtures from Google Sheets
  const fetchFixtures = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
      if (!jsonMatch) {
        throw new Error('Could not parse Google Sheets response');
      }
      
      const data = JSON.parse(jsonMatch[1]);
      
      const rows: any[] = [];
      if (data.table && data.table.rows) {
        data.table.rows.forEach((row: any) => {
          const rowData: any[] = [];
          if (row.c) {
            row.c.forEach((cell: any) => {
              rowData.push(cell ? (cell.v !== null ? cell.v : '') : '');
            });
          }
          rows.push(rowData);
        });
      }
      
      const matches: Match[] = rows.slice(1).map((row) => ({
        matchId: row[0] || '',
        date: row[1] || '',
        day: row[2] || '',
        time: row[3] || '',
        field: row[4] || '',
        homeTeam: row[6] || '',
        awayTeam: row[9] || '',
        division: row[11] || '',
        round: row[12] || '',
        status: row[13] || '',
        notes: row[15] || '',
      })).filter(m => m.matchId);
      
      setSaturdayMatches(matches.filter(m => m.day === 'Saturday'));
      setSundayMatches(matches.filter(m => m.day === 'Sunday'));
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Failed to fetch fixtures:', err);
      setError('Failed to load fixtures. Please check if the Google Sheet is public.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchFixtures, 60000);
    return () => clearInterval(interval);
  }, []);

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

      // SETTLE (30-70%): Static

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

  const getDivisionClass = (division: string) => {
    const d = division.toLowerCase();
    if (d.includes('mens')) return 'bg-blue-500';
    if (d.includes('mixed')) return 'bg-purple-500';
    if (d.includes('women')) return 'bg-pink-500';
    if (d.includes('senior')) return 'bg-orange-500';
    return 'bg-[#CFFF2E] text-[#0B3D2E]';
  };

  const getDivisionTextClass = (division: string) => {
    const d = division.toLowerCase();
    if (d.includes('mens') || d.includes('mixed') || d.includes('women') || d.includes('senior')) {
      return 'text-white';
    }
    return 'text-[#0B3D2E]';
  };

  const currentMatches = activeDay === 'Saturday' ? saturdayMatches : sundayMatches;

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

          {/* Day Tabs */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-4 md:mb-6">
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

          {/* Match Cards */}
          <div ref={cardsRef} className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[45vh] overflow-y-auto pr-1 sm:pr-2">
            {currentMatches.length > 0 ? (
              currentMatches.map((match) => (
                <div
                  key={match.matchId}
                  className="fixture-card bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:bg-white/15 transition-colors"
                >
                  {/* Mobile: Stack layout */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {/* Time & Field */}
                    <div className="flex items-center gap-2 sm:flex-shrink-0 sm:w-20">
                      <div className="text-[#CFFF2E] font-bold text-base sm:text-lg">
                        {match.time}
                      </div>
                      <div className="text-white/50 text-xs">
                        {match.field}
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex-1 flex items-center justify-between sm:justify-center gap-2 sm:gap-3">
                      <span className="text-white font-semibold text-xs sm:text-sm truncate max-w-[35%] sm:max-w-none">
                        {match.homeTeam}
                      </span>
                      <span className="text-white/40 font-bold text-xs">VS</span>
                      <span className="text-white font-semibold text-xs sm:text-sm truncate max-w-[35%] sm:max-w-none">
                        {match.awayTeam}
                      </span>
                    </div>

                    {/* Division & Status */}
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full ${getDivisionClass(match.division)} ${getDivisionTextClass(match.division)}`}>
                        {match.division.split(' ')[0].toUpperCase()}
                      </span>
                      <span className="text-white/50 text-[10px] sm:text-xs hidden sm:inline">
                        {match.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-white/40 animate-spin mx-auto mb-3 sm:mb-4" />
                <p className="text-white/60 text-sm">Loading fixtures...</p>
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
                onClick={fetchFixtures}
                disabled={isRefreshing}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs sm:text-sm transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] text-xs sm:text-sm font-semibold transition-colors">
                View All
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
