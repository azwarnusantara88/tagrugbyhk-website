import { useEffect, useState } from 'react';
import { Star, Shield } from 'lucide-react';
import { fetchPlayersToWatch, fetchTeams, type Player } from '../services/googleSheets';

interface PlayerWithTeam extends Player {
  teamLogo?: string;
  teamDivision?: string;
}

const PlayersToWatch = () => {
  const [players, setPlayers] = useState<PlayerWithTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const [playersData, teamsData] = await Promise.all([
          fetchPlayersToWatch(),
          fetchTeams()
        ]);
        
        const playersWithTeams = playersData.map(player => {
          const team = teamsData.find(t => t.teamId === player.teamId);
          return {
            ...player,
            teamLogo: team?.logoUrl || '',
            teamDivision: team?.division || ''
          };
        });
        
        setPlayers(playersWithTeams);
      } catch (error) {
        console.error('Error loading players:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white/60">
          <div className="w-8 h-8 border-2 border-[#dc7a5e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading players...</p>
        </div>
      </section>
    );
  }

  if (players.length === 0) {
    return (
      <section className="bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white/60">
          <Star className="w-12 h-12 mx-auto mb-4 text-[#dc7a5e]" />
          <p>No players marked as "Players to Watch" yet.</p>
          <p className="text-sm mt-2">Tick Column I in your PLAYERS tab to feature players.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0a0a0a] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 text-[#dc7a5e]" />
          <h2 className="text-2xl text-white font-bold">Players to Watch</h2>
          <span className="ml-auto text-white/40 text-sm">{players.length} featured</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.map(player => (
            <div key={player.playerId} className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors group">
              <div className="relative mb-3">
                {player.photoUrl ? (
                  <img 
                    src={player.photoUrl} 
                    alt={player.fullName} 
                    className="w-full aspect-square rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-[#dc7a5e]/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#dc7a5e]">{player.fullName.charAt(0)}</span>
                  </div>
                )}
                
                {player.teamLogo && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full p-1 shadow-lg">
                    <img 
                      src={player.teamLogo} 
                      alt={player.teamName}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                )}
              </div>
              
              <h3 className="text-white font-semibold text-sm truncate">{player.fullName}</h3>
              
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-[#dc7a5e]" />
                <p className="text-white/60 text-xs truncate">{player.teamName}</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#dc7a5e] text-xs">{player.position}</p>
                {player.number > 0 && (
                  <span className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">
                    #{player.number}
                  </span>
                )}
              </div>
              
              {player.teamDivision && (
                <p className="text-white/30 text-xs mt-1">{player.teamDivision}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayersToWatch;
