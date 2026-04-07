import { useEffect, useState } from 'react';
import { Trophy, MapPin, ChevronDown, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchFixtures, fetchTeams, type Fixture, type Team } from '../services/googleSheets';

const FixturesSection = () => {
  const [activeDay, setActiveDay] = useState<'Saturday' | 'Sunday'>('Saturday');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fixturesData, teamsData] = await Promise.all([
          fetchFixtures(),
          fetchTeams()
        ]);
        setFixtures(fixturesData);
        setTeams(teamsData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTeamLogo = (teamName: string): string => {
    const team = teams.find(t => t.teamName === teamName);
    return team?.logoUrl || '';
  };

  const saturdayMatches = fixtures.filter(m => m.day === 'Saturday');
  const sundayMatches = fixtures.filter(m => m.day === 'Sunday');
  const allMatches = [...saturdayMatches, ...sundayMatches];
  
  const divisions = ['All', ...Array.from(new Set(allMatches.map(m => m.division).filter(Boolean)))];
  
  const currentMatches = activeDay === 'Saturday' ? saturdayMatches : sundayMatches;
  const filteredMatches = selectedDivision === 'All' 
    ? currentMatches 
    : currentMatches.filter(m => m.division === selectedDivision);

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
    <section id="fixtures" className="bg-[#0B3D2E] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-[#CFFF2E]" />
          <h2 className="text-2xl text-white font-bold">Match Fixtures</h2>
        </div>
        
        <div className="flex gap-4 mb-6">
          {(['Saturday', 'Sunday'] as const).map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-full font-semibold ${activeDay === day ? 'bg-[#CFFF2E] text-[#0B3D2E]' : 'bg-white/10 text-white'}`}
            >
              {day}
            </button>
          ))}
        </div>

        {divisions.length > 1 && (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="appearance-none bg-white/10 text-white px-4 py-2 pr-10 rounded-full font-semibold cursor-pointer hover:bg-white/20"
              >
                {divisions.map(d => <option key={d} value={d} className="bg-[#0B3D2E]">{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-white/60">Loading fixtures...</div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map(match => {
              const homeLogo = getTeamLogo(match.homeTeam);
              const awayLogo = getTeamLogo(match.awayTeam);
              
              return (
                <div key={match.matchId} className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#CFFF2E]/20 text-[#CFFF2E] text-xs rounded-full">{match.division}</span>
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {match.field}
                      </span>
                    </div>
                    <span className="text-[#CFFF2E] font-semibold">{formatTime(match.time)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {homeLogo ? (
                        <img src={homeLogo} alt={match.homeTeam} className="w-10 h-10 rounded-full object-cover bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                          {match.homeTeam.charAt(0)}
                        </div>
                      )}
                      <span className="text-white font-semibold">{match.homeTeam}</span>
                    </div>
                    
                    <div className="px-4 text-white/40 font-bold">VS</div>
                    
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="text-white font-semibold text-right">{match.awayTeam}</span>
                      {awayLogo ? (
                        <img src={awayLogo} alt={match.awayTeam} className="w-10 h-10 rounded-full object-cover bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                          {match.awayTeam.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                    <Link 
                      to={`/match/${match.matchId}`}
                      className="flex items-center gap-2 text-[#CFFF2E] text-sm hover:underline"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FixturesSection;
