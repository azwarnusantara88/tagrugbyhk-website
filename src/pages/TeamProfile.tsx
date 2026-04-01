import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Medal } from 'lucide-react';
import { fetchTeamById, fetchPlayers, fetchFixtures, getDivisionStyle, type Team, type Player, type Fixture } from '../services/googleSheets';

const TeamProfilePage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!teamId) return;
      
      setIsLoading(true);
      try {
        const [teamData, playersData, fixturesData] = await Promise.all([
          fetchTeamById(teamId),
          fetchPlayers(teamId),
          fetchFixtures()
        ]);
        
        setTeam(teamData);
        setPlayers(playersData);
        
        // Filter fixtures for this team
        const teamFixtures = fixturesData.filter(f => 
          f.homeTeam === teamData?.teamName || f.awayTeam === teamData?.teamName
        );
        setFixtures(teamFixtures);
      } catch (err) {
        console.error('Failed to fetch team data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamData();
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[#0B3D2E]">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </nav>
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl text-white font-bold mb-2">Team Not Found</h1>
          <p className="text-white/60 mb-4">The team you're looking for doesn't exist.</p>
          <Link to="/" className="text-[#CFFF2E] hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const divisionStyle = getDivisionStyle(team.division);

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="text-white/60 text-sm">Team Profile</span>
        </div>
      </nav>

      {/* Team Header */}
      <header className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Division Badge */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${divisionStyle.bgClass} ${divisionStyle.textClass}`}>
              {team.division}
            </span>
          </div>

          {/* Team Name & Logo */}
          <div className="flex items-center gap-4 mb-6">
            {team.logoUrl ? (
              <img 
                src={team.logoUrl} 
                alt={team.teamName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#CFFF2E]"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CFFF2E] flex items-center justify-center">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#0B3D2E]" />
              </div>
            )}
            <div>
              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl text-white font-black"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                {team.teamName}
              </h1>
              {team.coach && (
                <p className="text-white/60 mt-1">Coach: {team.coach}</p>
              )}
            </div>
          </div>

          {/* Captain */}
          {team.captain && (
            <div className="flex items-center gap-2 text-[#CFFF2E]">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Captain: {team.captain}</span>
            </div>
          )}
        </div>
      </header>

      {/* Team Bio */}
      {team.bio && (
        <section className="px-4 sm:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              {team.bio}
            </p>
          </div>
        </section>
      )}

      {/* Squad */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#CFFF2E]" />
            Squad ({players.length} Players)
          </h2>
          
          {players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {players.map((player) => (
                <div 
                  key={player.playerId}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {player.photoUrl ? (
                      <img 
                        src={player.photoUrl} 
                        alt={player.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                        <span className="text-[#CFFF2E] font-bold text-sm">
                          {player.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm">{player.nickname || player.name.split(' ')[0]}</p>
                      {player.number > 0 && (
                        <p className="text-white/40 text-xs">#{player.number}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-white/50 text-xs">{player.position}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50">No player data available.</p>
          )}
        </div>
      </section>

      {/* Fixtures */}
      {fixtures.length > 0 && (
        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl text-white font-bold mb-6 flex items-center gap-2">
              <Medal className="w-6 h-6 text-[#CFFF2E]" />
              Fixtures
            </h2>
            
            <div className="space-y-2">
              {fixtures.map((fixture) => {
                const isHome = fixture.homeTeam === team.teamName;
                const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
                const hasScores = fixture.homeScore >= 0 && fixture.awayScore >= 0;
                
                return (
                  <div 
                    key={fixture.matchId}
                    className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[#CFFF2E] font-semibold">{fixture.time} · {fixture.field}</p>
                      <p className="text-white text-sm">{fixture.day}, {fixture.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">vs {opponent}</p>
                      {hasScores && (
                        <p className="text-[#CFFF2E] font-bold">
                          {isHome ? fixture.homeScore : fixture.awayScore} - {isHome ? fixture.awayScore : fixture.homeScore}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0B3D2E] border-t border-white/10 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-[#CFFF2E] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <p className="text-white/40 text-sm">
            © 2026 Hong Kong Tag Rugby. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TeamProfilePage;
