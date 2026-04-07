'use client';

import { useState, useEffect } from 'react';
import { getFixtures, getTeams } from '@/services/googleSheets';
import { format, parseISO, isValid } from 'date-fns';

interface Fixture {
  date: string;
  time: string;
  division: string;
  homeTeamId: string;
  homeTeam: string;
  homeScore: string;
  awayTeamId: string;
  awayTeam: string;
  awayScore: string;
  venue: string;
  pitch: string;
  matchType: string;
  round: string;
  completed: boolean;
}

interface Team {
  teamId: string;
  teamName: string;
  division: string;
  logoUrl: string;
}

export default function FixturesSection() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fixturesData, teamsData] = await Promise.all([
          getFixtures(),
          getTeams(),
        ]);
        setFixtures(fixturesData);
        setTeams(teamsData);
      } catch (err) {
        setError('Failed to load fixtures data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get unique divisions for filter
  const divisions = ['All', ...Array.from(new Set(fixtures.map(f => f.division).filter(Boolean)))];

  // Filter fixtures by division
  const filteredFixtures = selectedDivision === 'All' 
    ? fixtures 
    : fixtures.filter(f => f.division === selectedDivision);

  // Group fixtures by date
  const fixturesByDate = filteredFixtures.reduce((acc, fixture) => {
    if (!acc[fixture.date]) {
      acc[fixture.date] = [];
    }
    acc[fixture.date].push(fixture);
    return acc;
  }, {} as Record<string, Fixture[]>);

  // Sort dates
  const sortedDates = Object.keys(fixturesByDate).sort();

  // Helper function to get team logo by TeamID
  const getTeamLogo = (teamId: string): string => {
    if (!teamId) return '';
    const team = teams.find(t => t.teamId === teamId);
    return team?.logoUrl || '';
  };

  // Format date for display
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = parseISO(dateStr);
      if (!isValid(date)) return dateStr;
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <section id="fixtures" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fixtures...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="fixtures" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fixtures" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Fixtures & Results</h2>
          <p className="text-xl text-gray-600">Upcoming matches and recent results</p>
        </div>

        {/* Division Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {divisions.map((division) => (
            <button
              key={division}
              onClick={() => setSelectedDivision(division)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedDivision === division
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {division}
            </button>
          ))}
        </div>

        {/* Fixtures by Date */}
        <div className="space-y-8">
          {sortedDates.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>No fixtures found for the selected division.</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-3">
                  <h3 className="text-lg font-semibold">{formatDate(date)}</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {fixturesByDate[date].map((fixture, index) => {
                    const homeLogo = getTeamLogo(fixture.homeTeamId);
                    const awayLogo = getTeamLogo(fixture.awayTeamId);
                    
                    return (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* Match Info */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                              {fixture.time}
                            </span>
                            <span>{fixture.venue}</span>
                            {fixture.pitch && <span>Pitch {fixture.pitch}</span>}
                          </div>

                          {/* Teams & Score */}
                          <div className="flex items-center justify-center gap-4 flex-1">
                            {/* Home Team */}
                            <div className="flex items-center gap-3 flex-1 justify-end">
                              <span className="font-semibold text-gray-900 text-right">
                                {fixture.homeTeam}
                              </span>
                              {homeLogo && (
                                <img
                                  src={homeLogo}
                                  alt={`${fixture.homeTeam} logo`}
                                  className="w-10 h-10 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>

                            {/* Score */}
                            <div className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-lg min-w-[100px] text-center">
                              {fixture.completed ? (
                                <span className="text-gray-900">
                                  {fixture.homeScore} - {fixture.awayScore}
                                </span>
                              ) : (
                                <span className="text-gray-400">VS</span>
                              )}
                            </div>

                            {/* Away Team */}
                            <div className="flex items-center gap-3 flex-1">
                              {awayLogo && (
                                <img
                                  src={awayLogo}
                                  alt={`${fixture.awayTeam} logo`}
                                  className="w-10 h-10 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <span className="font-semibold text-gray-900">
                                {fixture.awayTeam}
                              </span>
                            </div>
                          </div>

                          {/* Match Type */}
                          <div className="text-sm text-gray-500 text-right lg:w-32">
                            {fixture.matchType && (
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                {fixture.matchType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
