import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { fetchStandings, type Standing } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const StandingsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
  const [standings, setStandings] = useState<Standing[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStandings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStandings();
        setStandings(data);
      } catch (err) {
        console.error('Failed to load standings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStandings();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadStandings, 60000);
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

      scrollTl.fromTo(
        headingRef.current,
        { y: '-20vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        tableRef.current,
        { y: '30vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      scrollTl.fromTo(
        headingRef.current,
        { y: 0, opacity: 1 },
        { y: '-15vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        tableRef.current,
        { y: 0, opacity: 1 },
        { y: '20vh', opacity: 0, ease: 'power2.in' },
        0.72
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [standings]);

  const divisions = ['All', ...Array.from(new Set(standings.map(s => s.division).filter(Boolean)))];
  
  const filteredStandings = selectedDivision === 'All' 
    ? standings 
    : standings.filter(s => s.division === selectedDivision);

  const getTrendIcon = (position: number) => {
    if (position <= 2) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (position >= 5) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-white/40" />;
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-400';
    if (position === 2) return 'text-gray-300';
    if (position === 3) return 'text-amber-600';
    return 'text-white';
  };

  return (
    <section
      ref={sectionRef}
      id="standings"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0B3D2E]">
        <div 
          className="absolute inset-0 opacity-20"
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
        <div ref={headingRef} className="w-full">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#CFFF2E]" />
              <span className="text-[#CFFF2E] font-semibold text-xs sm:text-sm uppercase tracking-wider">
                Tournament Standings
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl text-white font-black mb-2"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              DIVISION <span className="text-[#CFFF2E]\">STANDINGS</span>
            </h2>
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
              </div>
            </div>
          )}

          {/* Standings Table */}
          <div ref={tableRef} className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60\">Loading standings...</p>
              </div>
            ) : filteredStandings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-3 sm:px-4 py-3 text-left text-white/60 text-xs sm:text-sm font-semibold">Pos</th>
                      <th className="px-3 sm:px-4 py-3 text-left text-white/60 text-xs sm:text-sm font-semibold">Team</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold">P</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold\">W</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold\">L</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold\">PF</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold\">PA</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold\">Diff</th>
                      <th className="px-3 sm:px-4 py-3 text-center text-white/60 text-xs sm:text-sm font-semibold\">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStandings.map((standing) => (
                      <tr key={standing.teamId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm sm:text-base ${getPositionColor(standing.position)}`}>
                              {standing.position}
                            </span>
                            {getTrendIcon(standing.position)}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          <span className="text-white font-semibold text-sm sm:text-base">{standing.teamName}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-center text-white/80 text-sm\">{standing.played}</td>
                        <td className="px-3 sm:px-4 py-3 text-center text-green-400 text-sm\">{standing.won}</td>
                        <td className="px-3 sm:px-4 py-3 text-center text-red-400 text-sm\">{standing.lost}</td>
                        <td className="px-3 sm:px-4 py-3 text-center text-white/80 text-sm\">{standing.pointsFor}</td>
                        <td className="px-3 sm:px-4 py-3 text-center text-white/80 text-sm\">{standing.pointsAgainst}</td>
                        <td className="px-3 sm:px-4 py-3 text-center text-[#CFFF2E] text-sm font-semibold\">{standing.pointsDiff > 0 ? '+' : ''}{standing.pointsDiff}</td>
                        <td className="px-3 sm:px-4 py-3 text-center">
                          <span className="bg-[#CFFF2E] text-[#0B3D2E] px-2 py-1 rounded-full text-xs sm:text-sm font-bold\">
                            {standing.totalPoints}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Medal className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60\">No standings available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StandingsSection;
