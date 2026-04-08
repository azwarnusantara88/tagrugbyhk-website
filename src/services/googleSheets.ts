const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

const SHEET_GIDS = {
  FIXTURES: '0',
  TEAMS: '1275974115',
  PLAYERS: '652663105',
  NEWS: '1320981095',
  LADDERS: '397145122',
  CONFIG: '446704132',
  DATA: '104865886',
};

export interface Fixture {
  matchId: string;
  date: string;
  time: string;
  field: string;
  division: string;
  homeTeamId: string;
  homeTeam: string;
  awayTeamId: string;
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

async function fetchSheetData(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return parseCSV(await response.text());
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else current += char;
    }
    result.push(current.trim());
    return result;
  });
}

// Extract image URL from =IMAGE() formula
function extractImageUrl(formula: string): string {
  if (!formula) return '';
  const match = formula.match(/=IMAGE\(["']([^"']+)["']\)/i);
  return match ? match[1] : formula;
}

/**
 * Converts Google Drive sharing links to direct image URLs
 * Handles: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Returns: https://drive.google.com/uc?export=view&id=FILE_ID
 */
function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  
  // If already a direct URL, return as-is
  if (url.includes('uc?export=view')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: /file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([^\/\?]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: ?id=FILE_ID or open?id=FILE_ID
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch && !fileId) {
    fileId = idMatch[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url;
}

export async function fetchFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    matchId: row[0] || '',
    date: row[1] || '',
    time: row[3] || '',
    field: row[4] || '',
    division: row[11] || '',
    homeTeamId: row[5] || '',
    homeTeam: row[6] || '',
    awayTeamId: row[8] || '',
    awayTeam: row[9] || '',
    homeScore: parseInt(row[7]) || 0,
    awayScore: parseInt(row[10]) || 0,
    status: (row[13] as 'SCHEDULED' | 'LIVE' | 'FINAL') || 'SCHEDULED',
    day: row[2] || '',
  }));
}

// Alias for FixturesSection.tsx compatibility
export const getFixtures = fetchFixtures;

export async function fetchTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    teamId: row[0] || '',
    teamName: row[1] || '',
    division: row[2] || '',
    region: row[3] || '',
    captain: row[4] || '',
    // Column G (index 6) is LogoURL - convert Google Drive links to direct URLs
    logoUrl: convertGoogleDriveUrl(row[6] || ''),
    wins: 0,
    losses: 0,
    points: 0,
  }));
}

// Alias for FixturesSection.tsx compatibility
export const getTeams = fetchTeams;

export async function fetchPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    playerId: row[0] || '',
    teamId: row[1] || '',
    fullName: row[2] || '',
    teamName: row[3] || '',
    country: row[4] || '',
    number: parseInt(row[5]) || 0,
    position: row[6] || '',
    photoUrl: extractImageUrl(row[7] || ''),
    playersToWatch: row[8]?.toLowerCase() === 'true' || row[8] === 'TRUE',
  }));
}

export async function fetchPlayersToWatch(): Promise<Player[]> {
  const allPlayers = await fetchPlayers();
  return allPlayers.filter(player => player.playersToWatch);
}

export async function fetchNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    slug: row[0] || '',
    title: row[1] || '',
    date: row[2] || '',
    excerpt: row[3] || '',
    imageUrl: extractImageUrl(row[4] || ''),
    content: row[5] || '',
    author: row[6] || '',
  }));
}

export async function fetchStandings(): Promise<Standing[]> {
  const data = await fetchSheetData(SHEET_GIDS.LADDERS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
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

export async function fetchConfig(): Promise<Config> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  const config: Config = {
    informationPackUrl: '',
    tournamentName: 'Tag Asia Cup 2026',
    tournamentDate: 'April 11-12, 2026',
    venue: 'J-Green Sakai, Osaka',
  };
  if (data.length < 2) return config;
  data.slice(1).forEach(row => {
    const key = row[0]?.toLowerCase();
    if (key === 'informationpackurl') config.informationPackUrl = row[1] || '';
    if (key === 'tournamentname') config.tournamentName = row[1] || '';
    if (key === 'tournamentdate') config.tournamentDate = row[1] || '';
    if (key === 'venue') config.venue = row[1] || '';
  });
  return config;
}

export async function fetchTeamById(teamId: string): Promise<Team | null> {
  const teams = await fetchTeams();
  return teams.find(team => team.teamId === teamId) || null;
}

export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  const players = await fetchPlayers();
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

/**
 * Helper function to get team logo URL by TeamID
 * Used by FixturesSection to display team logos
 */
export async function getTeamLogo(teamId: string): Promise<string> {
  if (!teamId) return '';
  const team = await fetchTeamById(teamId);
  return team?.logoUrl || '';
}
