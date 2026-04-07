import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { fetchPlayers, type Player } from '../services/googleSheets';

interface TeamRosterProps {
  teamId: string;
}

const TeamRoster = ({ teamId }: TeamRosterProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      setIsLoading(true);
      try {
        const allPlayers = await fetchPlayers();
        const teamPlayers = allPlayers.filter(p => p.teamId === teamId);
        setPlayers(teamPlayers);
      } catch (err) {
        console.error('Failed to load players:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlayers();
  }, [teamId]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-white/50">
        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No players found</p>
      </div>
    );
  }

  return (
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
                alt={player.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                <span className="text-[#CFFF2E] font-bold text-sm">
                  {player.fullName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-sm">{player.fullName.split(' ')[0]}</p>
              {player.number > 0 && (
                <p className="text-white/40 text-xs">#{player.number}</p>
              )}
            </div>
          </div>
          <p className="text-white/50 text-xs">{player.position}</p>
        </div>
      ))}
    </div>
  );
};

export default TeamRoster;
