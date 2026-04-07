import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Shield, Flag } from 'lucide-react';
import { fetchPlayersToWatch, fetchTeams, type Player } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

interface PlayerWithTeam extends Player {
  teamLogo?: string;
  teamDivision?: string;
}

const PlayersToWatch = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<PlayerWithTeam[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch players from Google Sheets (only those marked as PlayersToWatch)
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const [playersData, teamsData] = await Promise.all([
          fetchPlayersToWatch(),
          fetchTeams()
        ]);
        
        // Merge player data with team info
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

  // GSAP animations
  useEffect(() => {
    if (loading || players.length === 0) return;
    
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
        { x: '-35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      const cards = cardsRef.current?.querySelectorAll('.player-card');
      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          index * 0.04
        );
      });

      // SETTLE (30-70%): Static viewing - no animation

      // EXIT (70-100%)
      scrollTl.fromTo(
        headingRef.current,
        { x: 0, opacity: 1 },
        { x: '-25vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { x: 0, opacity: 1 },
          { x: '-40vw', opacity: 0, ease: 'power2.in' },
          0.75 + index * 0.03
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, players]);

  // Get highlight based on position
  const getHighlight = (player: PlayerWithTeam): string => {
    if (player.position?.toLowerCase().includes('captain')) return 'Captain';
    if (player.number === 1) return 'Playmaker';
    if (player.position?.toLowerCase().includes('wing')) return 'Speedster';
    if (player.position?.toLowerCase().includes('center')) return 'Playmaker';
    return 'Star Player';
  };

  if (loading) {
    return (
      <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
        <div className="text-white text-xl">Loading Players...</div>
      </section>
    );
  }

  if (players.length === 0) {
    return (
      <section className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
        <div className="text-white/60 text-xl text-center px-6">
          <Star className="w-12 h-12 text-[#dc7a5e] mx-auto mb-4" />
          <p>No players marked as "Players to Watch" yet.</p>
          <p className="text-sm text-white/40 mt-2">Tick the checkbox in Column I of your PLAYERS tab to feature players here.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden"
      style={{ zIndex: 50 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-20 lg:py-0 gap-8 lg:gap-16">
        {/* Heading */}
        <div
          ref={headingRef}
          className="lg:w-[35%] text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-[#dc7a5e]" />
            <span className="text-[#dc7a5e] font-mono text-sm tracking-[0.3em] uppercase">
              Players to Watch
            </span>
          </div>
          <h2 className="font-display text-5xl lg:text-7xl font-bold text-white mb-6">
            STARS OF
            <br />
            <span className="text-[#dc7a5e]">THE GAME</span>
          </h2>
          <p className="text-white/60 text-lg max-w-md">
            Meet the standout players representing their teams at the Tag Asia Cup 2026. 
            These athletes bring skill, experience, and passion to the pitch.
          </p>
          
          {/* Stats summary */}
          <div className="mt-8 flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#dc7a5e]">{players.length}</div>
              <div className="text-white/50 text-sm">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#dc7a5e]">
                {new Set(players.map(p => p.teamName)).size}
              </div>
              <div className="text-white/50 text-sm">Teams</div>
            </div>
          </div>
        </div>

        {/* Player Cards Grid */}
        <div
          ref={cardsRef}
          className="lg:w-[60%] w-full"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {players.map((player, index) => (
              <div
                key={player.playerId || index}
                className="player-card group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-[#dc7a5e]/50 transition-all duration-300 hover:scale-105"
              >
                {/* Player Photo */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.fullName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#dc7a5e]/20 to-[#dc7a5e]/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#dc7a5e]">
                        {player.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Highlight badge */}
                  <div className="absolute top-2 right-2 bg-[#dc7a5e] text-white text-xs px-2 py-1 rounded-full font-medium">
                    {getHighlight(player)}
                  </div>
                  
                  {/* Team logo (if available) */}
                  {player.teamLogo && (
                    <div className="absolute top-2 left-2 w-8 h-8 bg-white/90 rounded-full p-1">
                      <img
                        src={player.teamLogo}
                        alt={player.teamName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Jersey number */}
                  {player.number > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {player.number}
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="p-3">
                  <h3 className="text-white font-bold text-sm truncate">
                    {player.fullName}
                  </h3>
                  
                  {/* Team link */}
                  <div className="flex items-center gap-1 mt-1 text-white/60 text-xs">
                    <Shield className="w-3 h-3 text-[#dc7a5e]" />
                    <span className="truncate">{player.teamName}</span>
                  </div>
                  
                  {/* Country */}
                  {player.country && (
                    <div className="flex items-center gap-1 mt-1 text-white/40 text-xs">
                      <Flag className="w-3 h-3" />
                      <span>{player.country}</span>
                    </div>
                  )}
                  
                  {/* Position */}
                  <div className="mt-2">
                    <span className="text-[#dc7a5e] text-xs font-medium">
                      {player.position || 'Player'}
                    </span>
                  </div>
                  
                  {/* Division tag */}
                  {player.teamDivision && (
                    <div className="mt-1 text-xs text-white/30 truncate">
                      {player.teamDivision}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlayersToWatch;
