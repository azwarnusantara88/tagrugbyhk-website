import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Crown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTeams, fetchPlayers, type Team, type Player } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const TeamRoster = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rosterCardRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load teams and players
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teamsData, playersData] = await Promise.all([
        fetchTeams(),
        fetchPlayers()
      ]);
      
      setTeams(teamsData);
      setPlayers(playersData);
      
      // Select first team by default
      setSelectedTeam(teamsData[0] || null);
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
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
        rosterCardRef.current,
        { x: '-70vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.roster-h2',
        { x: '30vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        '.roster-body',
        { y: '6vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(
        '.roster-cta',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0.12
      );

      // EXIT (70-100%)
      scrollTl.fromTo(
        rosterCardRef.current,
        { x: 0, opacity: 1 },
        { x: '-45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.roster-h2, .roster-body, .roster-cta',
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        '.roster-bg',
        { scale: 1 },
        { scale: 1.05, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Get players for selected team
  const teamPlayers = selectedTeam 
    ? players.filter(p => p.teamId === selectedTeam.teamId)
    : [];

  return (
    <section
      ref={sectionRef}
      id="teams"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="roster-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/team_training.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/70 md:bg-[#0B3D2E]/65" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center">
          {/* Left: Roster Card */}
          <div
            ref={rosterCardRef}
            className="card-white overflow-hidden order-2 md:order-1"
          >
            {/* Team Photo Strip */}
            <div
              className="h-24 sm:h-32 md:h-40 bg-cover bg-center relative"
              style={{ backgroundImage: 'url(/pitch_corner.jpg)' }}
            >
              {selectedTeam?.logoUrl && (
                <div className="absolute bottom-2 right-2 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full p-1 shadow-lg">
                  <img 
                    src={selectedTeam.logoUrl} 
                    alt={selectedTeam.teamName}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Roster Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Team Selector */}
              {teams.length > 1 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {teams.map(team => (
                    <button
                      key={team.teamId}
                      onClick={() => setSelectedTeam(team)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        selectedTeam?.teamId === team.teamId
                          ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                          : 'bg-[#0B3D2E]/10 text-[#0B3D2E] hover:bg-[#0B3D2E]/20'
                      }`}
                    >
                      {team.teamName}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CFFF2E] flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B3D2E]" />
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl font-bold text-[#0B3D2E]"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    {selectedTeam?.teamName || 'HKTRL Teams'}
                  </h3>
                  <p className="text-[#0B3D2E]/60 text-xs sm:text-sm">
                    {teamPlayers.length} Players · {selectedTeam?.division || 'Tag Asia Cup 2026'}
                  </p>
                </div>
              </div>

              {/* Captain */}
              {selectedTeam?.captain && (
                <div className="flex items-center gap-2 mb-4 sm:mb-6 p-2 sm:p-3 bg-[#CFFF2E]/10 rounded-lg sm:rounded-xl">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#CFFF2E]" />
                  <span className="text-[#0B3D2E] text-xs sm:text-sm font-medium">
                    Captain: {selectedTeam.captain}
                  </span>
                </div>
              )}

              {/* Player Grid */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-[#0B3D2E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[#0B3D2E]/60 text-sm">Loading players...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {teamPlayers.slice(0, 12).map((player) => (
                    <div
                      key={player.playerId}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 bg-[#0B3D2E]/5 rounded-lg text-center hover:bg-[#0B3D2E]/10 transition-colors"
                    >
                      <span className="text-[#0B3D2E] text-[10px] sm:text-sm font-medium">
                        {player.nickname || player.name.split(' ')[0]}
                      </span>
                      {player.number > 0 && (
                        <span className="text-[#0B3D2E]/40 text-[8px] sm:text-xs ml-1">
                          #{player.number}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* View Full Team Link */}
              {selectedTeam && (
                <Link
                  to={`/team/${selectedTeam.teamId}`}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#0B3D2E] text-white rounded-full text-sm font-semibold hover:bg-[#0B3D2E]/90 transition-colors"
                >
                  View Full Team
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Right: Text Content */}
          <div ref={textGroupRef} className="space-y-4 sm:space-y-6 order-1 md:order-2 text-center md:text-left">
            <h2
              className="roster-h2 text-3xl sm:text-4xl lg:text-5xl text-white font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              THE
              <br />
              <span className="text-[#CFFF2E]">SQUAD</span>
            </h2>

            <p className="roster-body text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
              Meet the HKTRL teams representing Hong Kong at the Tag Asia Cup 2026. 
              Click on any team to view their full roster, fixtures, and stats.
            </p>

            {/* All Teams List */}
            <div className="space-y-2">
              {teams.map((team) => (
                <Link
                  key={team.teamId}
                  to={`/team/${team.teamId}`}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {team.logoUrl ? (
                      <img 
                        src={team.logoUrl} 
                        alt={team.teamName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#CFFF2E]" />
                      </div>
                    )}
                    <span className="text-white font-medium group-hover:text-[#CFFF2E] transition-colors">
                      {team.teamName}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#CFFF2E] transition-colors" />
                </Link>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8 max-w-xs mx-auto md:mx-0">
              {[
                { label: 'Teams', value: teams.length.toString() },
                { label: 'Players', value: players.length.toString() },
                { label: 'Divisions', value: '5' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-2 sm:p-4 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm"
                >
                  <div
                    className="text-xl sm:text-2xl font-black text-[#CFFF2E]"
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-[10px] sm:text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamRoster;
