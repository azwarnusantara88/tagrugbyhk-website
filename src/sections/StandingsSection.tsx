import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, TrendingUp, ChevronDown, RefreshCw } from 'lucide-react';
import { fetchStandings, getDivisionStyle, getAbbreviatedDivision, type Standing } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const StandingsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
  const [standings, setStandings] = useState<Standing[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadStandings = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStandings(selectedDivision === 'All' ? undefined : selectedDivision);
      setStandings(data);
    } catch (err) {
      console.error('Failed to load standings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStandings();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadStandings, 60000);
    return () => clearInterval(interval);
  }, [selectedDivision]);

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
        { y: '-25vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        tableRef.current,
        { y: '20vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // EXIT (70-100%)
      scrollTl.fromTo(
        headingRef.current,
        { y: 0, opacity: 1 },
        { y: '-15vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        tableRef.current,
        { y: 0, opacity: 1 },
        { y: '15vh', opacity: 0, ease: 'power2.in' },
        0.72
      );

      scrollTl.fromTo(
        '.standings-bg',
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Get unique divisions
  const divisions = ['All', ...Array.from(new Set(standings.map(s => s.division)))];

  // Filter standings by division
  const filteredStandings = selectedDivision === 'All' 
    ? standings 
    : standings.filter(s => s.division === selectedDivision);

  return (
    <section
      ref={sectionRef}
      id="standings"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="standings-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_midfield_new.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/75 md:bg-[#0B3D2E]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div ref={headingRef} className="w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#CFFF2E]" />
                <span className="text-[#CFFF2E] font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  Tournament Standings
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white font-black"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                DIVISION <span className="text-[#CFFF2E]">STANDINGS</span>
              </h2>
            </div>
            
            {/* Division Filter */}
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

          {/* Standings Table */}
          <div ref={tableRef} className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 text-white/40 animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading standings...</p>
              </div>
            ) : filteredStandings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/10 text-white/60 text-xs sm:text-sm">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Pos</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Team</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">P</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">W</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">D</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">L</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center hidden sm:table-cell">PF</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center hidden sm:table-cell">PA</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStandings.map((team, index) => {
                      const divisionStyle = getDivisionStyle(team.division);
                      const isTop3 = index < 3;
                      
                      return (
                        <tr 
                          key={team.teamId}
                          className={`border-t border-white/10 hover:bg-white/5 transition-colors ${isTop3 ? 'bg-[#CFFF2E]/5' : ''}`}
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              index === 0 ? 'bg-[#CFFF2E] text-[#0B3D2E]' :
                              index === 1 ? 'bg-gray-300 text-[#0B3D2E]' :
                              index === 2 ? 'bg-amber-600 text-white' :
                              'bg-white/10 text-white/60'
                            }`}>
                              {team.position}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${divisionStyle.bgClass}`} />
                              <span className="text-white font-medium text-xs sm:text-sm">{team.teamName}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-white/70 text-xs sm:text-sm">{team.played}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-green-400 text-xs sm:text-sm">{team.won}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-yellow-400 text-xs sm:text-sm">{team.drawn}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-red-400 text-xs sm:text-sm">{team.lost}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-white/70 text-xs sm:text-sm hidden sm:table-cell">{team.pointsFor}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-white/70 text-xs sm:text-sm hidden sm:table-cell">{team.pointsAgainst}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <span className="text-[#CFFF2E] font-bold text-sm sm:text-base">{team.totalPoints}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60">No standings available yet. Check back after matches begin!</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs text-white/50">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#CFFF2E]" />
              <span>1st Place</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span>2nd Place</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <span>3rd Place</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StandingsSection;
