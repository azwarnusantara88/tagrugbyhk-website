import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { fetchPlayersToWatch, type Player } from '../services/googleSheets';

const PlayersToWatch = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const loadPlayers = async () => {
      const data = await fetchPlayersToWatch();
      setPlayers(data);
    };
    loadPlayers();
  }, []);

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
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.map(player => (
            <div key={player.playerId} className="bg-white/10 rounded-xl p-4">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.fullName} className="w-full aspect-square rounded-lg object-cover mb-3" />
              ) : (
                <div className="w-full aspect-square rounded-lg bg-[#dc7a5e]/20 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-[#dc7a5e]">{player.fullName.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-white font-semibold text-sm truncate">{player.fullName}</h3>
              <p className="text-white/60 text-xs truncate">{player.teamName}</p>
              <p className="text-[#dc7a5e] text-xs">{player.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayersToWatch;
