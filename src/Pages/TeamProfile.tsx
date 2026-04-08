import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Crown, Medal, MapPin, Calendar, Clock } from 'lucide-react';
import { fetchTeamById, fetchPlayers, fetchFixtures, fetchStandings, getDivisionStyle, type Team, type Player, type Fixture, type Standing } from '../services/googleSheets';

const TeamProfilePage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      if (!teamId) return;

      setIsLoading(true);
      try {
        const [teamData, playersData, fixturesData, standingsData] = await Promise.all([
          fetchTeamById(teamId),
          fetchPlayers(teamId),
          fetchFixtures(),
          fetchStandings()
        ]);

        setTeam(teamData);
        setPlayers(playersData);

        // Filter fixtures for this team
        const teamFixtures = fixturesData.filter(f =>
          f.homeTeamId === teamId || f.awayTeamId === teamId
        );
        setFixtures(teamFixtures);

        // Find team standing
        const teamStanding = standingsData.find(s => s.teamId === teamId);
        setStanding(teamStanding || null);
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
            <span
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: divisionStyle.color,
                color: divisionStyle.textClass.includes('white') ? 'white' : '#0B3D2E',
              }}
            >
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
              {team.shortCode && (
                <p className="text-white/60 mt-1">{team.shortCode}</p>
              )}
            </div>
          </div>

          {/* Team Info */}
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
            {team.region && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#CFFF2E]" />
                <span>{team.region}</span>
              </div>
            )}
            {team.category && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#CFFF2E]" />
                <span>{team.category}</span>
              </div>
            )}
            {team.founded && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#CFFF2E]" />
                <span>Founded {team.founded}</span>
              </div>
            )}
          </div>

          {/* Captain & Coach */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {team.captain && (
              <div className="flex items-center gap-2 text-[#CFFF2E]">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Captain: {team.captain}</span>
              </div>
            )}
            {team.coach && (
              <div className="flex items-center gap-2 text-white/70">
                <Users className="w-5 h-5" />
                <span>Coach: {team.coach}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Standing Stats */}
      {standing && (
        <section className="px-4 sm:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-6">
              <h2 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-[#CFFF2E]" />
                Tournament Standing
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#CFFF2E]">{standing.position}</p>
                  <p className="text-white/50 text-xs">Position</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{standing.played}</p>
                  <p className="text-white/50 text-xs">Played</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-green-400">{standing.won}</p>
                  <p className="text-white/50 text-xs">Won</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-red-400">{standing.lost}</p>
                  <p className="text-white/50 text-xs">Lost</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{standing.pointsFor}</p>
                  <p className="text-white/50 text-xs">Points For</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-[#CFFF2E]">{standing.totalPoints}</p>
                  <p className="text-white/50 text-xs">Total Points</p>
                </div>
              </div>
              {standing.form && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-sm">Recent Form</p>
                  <div className="flex gap-1 mt-1">
                    {standing.form.split('').map((result, i) => (
                      <span
                        key={i}
                        className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                          result === 'W' ? 'bg-green-500 text-white' :
                          result === 'D' ? 'bg-yellow-500 text-white' :
                          result === 'L' ? 'bg-red-500 text-white' :
                          'bg-white/10 text-white/50'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Team Bio */}
      {team.website && (
        <section className="px-4 sm:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <a
              href={team.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#CFFF2E] hover:underline"
            >
              Visit Team Website
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>
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
              {players.map((player) => {
                const initials = player.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={player.playerId}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                          <span className="text-[#CFFF2E] font-bold text-sm">{initials}</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm truncate">{player.fullName}</p>
                        {player.number > 0 && (
                          <p className="text-white/40 text-xs">#{player.number}</p>
                        )}
                      </div>
                    </div>
                    {player.position && (
                      <p className="text-white/50 text-xs">{player.position}</p>
                    )}
                    {player.playersToWatch && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-[#CFFF2E]/20 rounded text-[10px] text-[#CFFF2E]">
                        Player to Watch
                      </span>
                    )}
                  </div>
                );
              })}
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
              <Clock className="w-6 h-6 text-[#CFFF2E]" />
              Fixtures
            </h2>

            <div className="space-y-2">
              {fixtures.map((fixture) => {
                const isHome = fixture.homeTeamId === teamId;
                const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;
                const hasScores = fixture.homeScore > 0 || fixture.awayScore > 0;
                const teamScore = isHome ? fixture.homeScore : fixture.awayScore;
                const opponentScore = isHome ? fixture.awayScore : fixture.homeScore;

                return (
                  <div
                    key={fixture.matchId}
                    className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[#CFFF2E] font-semibold">{fixture.time} · {fixture.field}</p>
                      <p className="text-white text-sm">{fixture.day}, {fixture.date}</p>
                      <p className="text-white/50 text-xs">{fixture.round}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">vs {opponent}</p>
                      {hasScores && (
                        <p className={`font-bold ${
                          teamScore > opponentScore ? 'text-green-400' :
                          teamScore < opponentScore ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {teamScore} - {opponentScore}
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
