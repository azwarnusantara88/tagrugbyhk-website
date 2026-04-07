import { useEffect, useState } from 'react';
import { Trophy, Calendar, MapPin } from 'lucide-react';
import { fetchFixtures, type Fixture } from '../services/googleSheets';

const FixturesSection = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [activeDay, setActiveDay] = useState<'Saturday' | 'Sunday'>('Saturday');

  useEffect(() => {
    const loadFixtures = async () => {
      const data = await fetchFixtures();
      setFixtures(data);
    };
    loadFixtures();
    const interval = setInterval(loadFixtures, 60000);
    return () => clearInterval(interval);
  }, []);

  const saturdayMatches = fixtures.filter(m => m.day === 'Saturday');
  const sundayMatches = fixtures.filter(m => m.day === 'Sunday');
  const currentMatches = activeDay === 'Saturday' ? saturdayMatches : sundayMatches;

  return (
    <section id="fixtures" className="bg-[#0B3D2E] py-16 px-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="space-y-3">
          {currentMatches.map(match => (
            <div key={match.matchId} className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[#CFFF2E] font-semibold">{match.time}</p>
                <p className="text-white/60 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {match.date}
                </p>
                <p className="text-white/40 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {match.field}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{match.homeTeam}</p>
                <p className="text-white/40 text-xs">vs</p>
                <p className="text-white font-semibold">{match.awayTeam}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FixturesSection;
