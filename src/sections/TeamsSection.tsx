import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, MapPin, Crown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTeams, getDivisionStyle, type Team } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const TeamsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true);
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData.filter(t => t.active));
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Heading animation
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

      // Cards stagger animation
      const cards = cardsRef.current?.querySelectorAll('.team-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, teams]);

  // Get unique divisions
  const divisions = ['All', ...Array.from(new Set(teams.map(t => t.division).filter(Boolean)))];

  // Filter teams by division
  const filteredTeams = selectedDivision === 'All'
    ? teams
    : teams.filter(t => t.division === selectedDivision);

  if (isLoading) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-[#0B3D2E] py-20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading teams...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="teams"
      className="relative w-full min-h-screen bg-[#0B3D2E] py-20 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E]/20 rounded-full mb-4">
            <Users className="w-5 h-5 text-[#CFFF2E]" />
            <span className="text-[#CFFF2E] text-sm font-semibold uppercase tracking-wider">
              Tournament Teams
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl text-white font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            PARTICIPATING <span className="text-[#CFFF2E]">TEAMS</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {teams.length} teams from across Asia competing in {divisions.length - 1} divisions
          </p>
        </div>

        {/* Division Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {divisions.map((division) => (
            <button
              key={division}
              onClick={() => setSelectedDivision(division)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedDivision === division
                  ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {division === 'All' ? 'All Teams' : division}
            </button>
          ))}
        </div>

        {/* Teams Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredTeams.map((team) => {
            const divisionStyle = getDivisionStyle(team.division);
            return (
              <Link
                key={team.teamId}
                to={`/team/${team.teamId}`}
                className="team-card group bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#CFFF2E]/30 transition-all"
              >
                {/* Division Badge */}
                <div className="mb-3">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: divisionStyle.color,
                      color: divisionStyle.textClass.includes('white') ? 'white' : '#0B3D2E',
                    }}
                  >
                    {team.division}
                  </span>
                </div>

                {/* Team Logo/Icon */}
                <div className="flex items-center gap-3 mb-4">
                  {team.logoUrl ? (
                    <img
                      src={team.logoUrl}
                      alt={team.teamName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#CFFF2E]/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#CFFF2E]/20 flex items-center justify-center">
                      <span className="text-[#CFFF2E] font-bold text-lg">
                        {team.shortCode || team.teamName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#CFFF2E] transition-colors">
                      {team.teamName}
                    </h3>
                    <p className="text-white/40 text-xs">{team.category}</p>
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-4 h-4 text-[#CFFF2E]" />
                    <span>{team.region}</span>
                  </div>
                  {team.captain && (
                    <div className="flex items-center gap-2 text-white/60">
                      <Crown className="w-4 h-4 text-[#CFFF2E]" />
                      <span>Capt: {team.captain}</span>
                    </div>
                  )}
                </div>

                {/* View Link */}
                <div className="mt-4 flex items-center gap-1 text-[#CFFF2E] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No teams found for this division.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamsSection;
