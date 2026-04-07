import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Medal } from 'lucide-react';
import { fetchTeamById, fetchPlayersByTeam, fetchFixtures, type Team, type Player, type Fixture } from '../services/googleSheets';

const TeamProfilePage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!teamId) return;
      setLoading(true);
      const [teamData, playersData, fixturesData] = await Promise.all([
        fetchTeamById(teamId),
        fetchPlayersByTeam(teamId),
        fetchFixtures()
      ]);
      setTeam(teamData);
      setPlayers(playersData);
      setFixtures(fixturesData.filter(f => f.homeTeam === teamData?.teamName || f.awayTeam === teamData?.teamName));
      setLoading(false);
    };
    loadData();
  }, [teamId]);

  if (loading) return <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center text-white">Loading...</div>;
  if (!team) return <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center text-white">Team not found</div>;

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E]">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </nav>

      <header className="pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-500/20 text-purple-300 mb-4 inline-block">
            {team.division}
          </span>
          <div className="flex items-center gap-4 mb-6">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.teamName} className="w-20 h-20 rounded-full object-cover border-2 border-[#CFFF2E]" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#CFFF2E] flex items-center justify-center">
                <Users className="w-10 h-10 text-[#0B3D2E]" />
              </div>
            )}
            <h1 className="text-4xl text-white font-black">{team.teamName}</h1>
          </div>
          {team.captain && (
            <div className="flex items-center gap-2 text-[#CFFF2E]">
              <Crown className="w-5 h-5" /> Captain: {team.captain}
            </div>
          )}
        </div>
      </header>

      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#CFFF2E]" /> Squad ({players.length})
          </h2>
          {players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {players.map(player => (
                <div key={player.playerId} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {player.photoUrl ? (
                      <img src={player.photoUrl} alt={player.fullName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                        <span className="text-[#CFFF2E] font-bold">{player.fullName.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm">{player.fullName.split(' ')[0]}</p>
                      {player.number > 0 && <p className="text-white/40 text-xs">#{player.number}</p>}
                    </div>
                  </div>
                  <p className="text-white/50 text-xs">{player.position}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-white/50">No player data.</p>}
        </div>
      </section>

      {fixtures.length > 0 && (
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
              <Medal className="w-6 h-6 text-[#CFFF2E]" /> Fixtures
            </h2>
            <div className="space-y-2">
              {fixtures.map(fixture => (
                <div key={fixture.matchId} className="bg-white/5 rounded-xl p-4 flex justify-between">
                  <div>
                    <p className="text-[#CFFF2E] font-semibold">{fixture.time} · {fixture.field}</p>
                    <p className="text-white text-sm">{fixture.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">vs {fixture.homeTeam === team.teamName ? fixture.awayTeam : fixture.homeTeam}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default TeamProfilePage;
