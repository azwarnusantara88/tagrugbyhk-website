// Google Sheets Service - Client-side fetching for live data
// Your Sheet ID: 1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM

const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

// Your GID values from your Google Sheet tabs:
const SHEET_GIDS = {
  FIXTURES: '0',
  TEAMS: '1275974115',
  PLAYERS: '652663105',
  NEWS: '1320981095',
  LADDERS: '397145122',
  CONFIG: '446704132',
  DATA: '104865886',
};

// ============================================
// INTERFACES
// ============================================

export interface Fixture {
  matchId: string;
  date: string;
  time: string;
  field: string;
  division: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINAL';
  day?: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  division: string;
  region: string;
  captain: string;
  logoUrl: string;
  wins: number;
  losses: number;
  points: number;
}

export interface Player {
  playerId: string;
  teamId: string;
  fullName: string;
  teamName: string;
  country: string;
  number: number;
  position: string;
  photoUrl: string;
  playersToWatch: boolean;
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  content: string;
  author: string;
  category?: string;
}

export interface Standing {
  teamId: string;
  teamName: string;
  division: string;
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  totalPoints: number;
  position: number;
}

export interface Config {
  informationPackUrl: string;
  tournamentName: string;
  tournamentDate: string;
  venue: string;
}

// ============================================
// CSV FETCH FUNCTION
// ============================================
async function fetchSheetData(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

// ============================================
// CSV PARSER
// ============================================
function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

// ============================================
// FETCH FIXTURES
// ============================================
export async function fetchFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    matchId: row[0] || '',
    date: row[1] || '',
    time: row[2] || '',
    field: row[3] || '',
    division: row[4] || '',
    homeTeam: row[5] || '',
    awayTeam: row[6] || '',
    homeScore: parseInt(row[7]) || 0,
    awayScore: parseInt(row[8]) || 0,
    status: (row[9] as 'SCHEDULED' | 'LIVE' | 'FINAL') || 'SCHEDULED',
    day: row[10] || '',
  }));
}

// ============================================
// FETCH TEAMS
// ============================================
export async function fetchTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    teamId: row[0] || '',
    teamName: row[1] || '',
    division: row[2] || '',
    region: row[3] || '',
    captain: row[4] || '',
    logoUrl: row[5] || '',
    wins: parseInt(row[6]) || 0,
    losses: parseInt(row[7]) || 0,
    points: parseInt(row[8]) || 0,
  }));
}

// ============================================
// FETCH PLAYERS
// ============================================
export async function fetchPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    playerId: row[0] || '',
    teamId: row[1] || '',
    fullName: row[2] || '',
    teamName: row[3] || '',
    country: row[4] || '',
    number: parseInt(row[5]) || 0,
    position: row[6] || '',
    photoUrl: row[7] || '',
    playersToWatch: row[8]?.toLowerCase() === 'true' || row[8] === 'TRUE' || row[8] === '1' || row[8]?.toLowerCase() === 'yes',
  }));
}

// ============================================
// FETCH PLAYERS TO WATCH (filtered)
// ============================================
export async function fetchPlayersToWatch(): Promise<Player[]> {
  const allPlayers = await fetchPlayers();
  return allPlayers.filter(player => player.playersToWatch);
}

// ============================================
// FETCH NEWS
// ============================================
export async function fetchNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    slug: row[0] || '',
    title: row[1] || '',
    date: row[2] || '',
    excerpt: row[3] || '',
    imageUrl: row[4] || '',
    content: row[5] || '',
    author: row[6] || '',
    category: row[7] || 'General',
  }));
}

// ============================================
// FETCH STANDINGS/LADDERS
// ============================================
export async function fetchStandings(): Promise<Standing[]> {
  const data = await fetchSheetData(SHEET_GIDS.LADDERS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    teamId: row[0] || '',
    teamName: row[1] || '',
    division: row[2] || '',
    played: parseInt(row[3]) || 0,
    won: parseInt(row[4]) || 0,
    lost: parseInt(row[5]) || 0,
    pointsFor: parseInt(row[6]) || 0,
    pointsAgainst: parseInt(row[7]) || 0,
    pointsDiff: parseInt(row[8]) || 0,
    totalPoints: parseInt(row[9]) || 0,
    position: parseInt(row[10]) || 0,
  }));
}

// ============================================
// FETCH CONFIG
// ============================================
export async function fetchConfig(): Promise<Config> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  if (data.length < 2) {
    return {
      informationPackUrl: '',
      tournamentName: 'Tag Asia Cup 2026',
      tournamentDate: 'April 11-12, 2026',
      venue: 'J-Green Sakai, Osaka',
    };
  }
  
  const rows = data.slice(1);
  const config: Config = {
    informationPackUrl: '',
    tournamentName: 'Tag Asia Cup 2026',
    tournamentDate: 'April 11-12, 2026',
    venue: 'J-Green Sakai, Osaka',
  };
  
  rows.forEach(row => {
    const key = row[0]?.toLowerCase();
    const value = row[1] || '';
    if (key === 'informationpackurl') config.informationPackUrl = value;
    if (key === 'tournamentname') config.tournamentName = value;
    if (key === 'tournamentdate') config.tournamentDate = value;
    if (key === 'venue') config.venue = value;
  });
  
  return config;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function fetchTeamById(teamId: string): Promise<Team | null> {
  const teams = await fetchTeams();
  return teams.find(team => team.teamId === teamId) || null;
}

export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  const players = await fetchPlayers();
  return players.filter(player => player.teamId === teamId);
}

export async function fetchPlayersToWatchByTeam(teamId: string): Promise<Player[]> {
  const players = await fetchPlayersToWatch();
  return players.filter(player => player.teamId === teamId);
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await fetchNews();
  return news.find(item => item.slug === slug) || null;
}

export async function fetchFixturesByTeam(teamId: string): Promise<Fixture[]> {
  const fixtures = await fetchFixtures();
  return fixtures.filter(
    f => f.homeTeam.includes(teamId) || f.awayTeam.includes(teamId)
  );
}

// ============================================
// DIVISION STYLE HELPER
// ============================================
export const getDivisionStyle = (division: string): { bgClass: string; textClass: string } => {
  const styles: Record<string, { bgClass: string; textClass: string }> = {
    'Mixed Open': { bgClass: 'bg-purple-500/20', textClass: 'text-purple-300' },
    'Mens Open': { bgClass: 'bg-blue-500/20', textClass: 'text-blue-300' },
    'Womens Open': { bgClass: 'bg-pink-500/20', textClass: 'text-pink-300' },
    'Senior Mens': { bgClass: 'bg-amber-500/20', textClass: 'text-amber-300' },
  };
  return styles[division] || { bgClass: 'bg-gray-500/20', textClass: 'text-gray-300' };
};
