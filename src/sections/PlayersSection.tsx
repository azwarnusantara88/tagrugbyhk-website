import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Users, Trophy, ChevronRight } from 'lucide-react';
import { fetchPlayers, fetchPlayersToWatch, getDivisionStyle, type Player } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const PlayersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [playersToWatch, setPlayersToWatch] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'watch'>('watch');

  useEffect(() => {
    const loadPlayers = async () => {
      setIsLoading(true);
      try {
        const [allPlayers, watchPlayers] = await Promise.all([
          fetchPlayers(),
          fetchPlayersToWatch(),
        ]);
        setPlayers(allPlayers);
        setPlayersToWatch(watchPlayers);
      } catch (err) {
        console.error('Failed to load players:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlayers();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = contentRef.current?.querySelectorAll('.player-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, activeTab]);

  const displayPlayers = activeTab === 'watch' ? playersToWatch : players;

  if (isLoading) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-[#0B3D2E] py-20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading players...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="players"
      className="relative w-full min-h-screen bg-[#0B3D2E] py-20 px-4 sm:px-6"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E]/20 rounded-full mb-4">
            <Users className="w-5 h-5 text-[#CFFF2E]" />
            <span className="text-[#CFFF2E] text-sm font-semibold uppercase tracking-wider">
              Player Profiles
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            {activeTab === 'watch' ? (
              <>
                PLAYERS <span className="text-[#CFFF2E]">TO WATCH</span>
              </>
            ) : (
              <>
                ALL <span className="text-[#CFFF2E]">PLAYERS</span>
              </>
            )}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {activeTab === 'watch'
              ? `Featured players to keep an eye on during the tournament`
              : `Complete roster of all ${players.length} players across all teams`}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('watch')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'watch'
                ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Star className="w-4 h-4" />
            Players to Watch ({playersToWatch.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4" />
            All Players ({players.length})
          </button>
        </div>

        {/* Players Grid */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {displayPlayers.map((player) => {
            const divisionStyle = getDivisionStyle(player.teamName);
            const initials = player.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={player.playerId}
                className="player-card group bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#CFFF2E]/30 transition-all"
              >
                {/* Player Header */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Avatar */}
                  {player.photoUrl ? (
                    <img
                      src={player.photoUrl}
                      alt={player.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#CFFF2E]/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#CFFF2E]/30 to-[#0B3D2E] flex items-center justify-center border-2 border-[#CFFF2E]/30">
                      <span className="text-[#CFFF2E] font-bold text-lg">{initials}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#CFFF2E] transition-colors truncate">
                      {player.fullName}
                    </h3>

                    {/* Team */}
                    <p className="text-white/50 text-xs mt-0.5 truncate">{player.teamName}</p>

                    {/* Division Badge */}
                    <span
                      className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold"
                      style={{
                        backgroundColor: divisionStyle.color,
                        color: divisionStyle.textClass.includes('white') ? 'white' : '#0B3D2E',
                      }}
                    >
                      {player.teamName}
                    </span>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {player.number > 0 && (
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-[#CFFF2E] font-bold text-lg">#{player.number}</p>
                      <p className="text-white/40 text-[10px]">Number</p>
                    </div>
                  )}
                  {player.position && (
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-white font-bold text-sm truncate">{player.position}</p>
                      <p className="text-white/40 text-[10px]">Position</p>
                    </div>
                  )}
                  {player.tries > 0 && (
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <p className="text-[#CFFF2E] font-bold text-lg">{player.tries}</p>
                      <p className="text-white/40 text-[10px]">Tries</p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {player.bio && (
                  <p className="text-white/50 text-xs line-clamp-2 mb-3">{player.bio}</p>
                )}

                {/* Players to Watch Badge */}
                {player.playersToWatch && (
                  <div className="flex items-center gap-1.5 text-[#CFFF2E]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-semibold">Player to Watch</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {displayPlayers.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">
              {activeTab === 'watch'
                ? 'No featured players yet. Check back soon!'
                : 'No players found.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlayersSection;
