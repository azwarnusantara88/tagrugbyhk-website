import { cache } from 'react';

// Revalidate every 5 minutes
export const revalidate = 300;

const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

// Sheet GIDs
const SHEET_GIDS = {
  FIXTURES: '0',
  TEAMS: '1275974115',
  STANDINGS: '1885819712',
  LOCATIONS: '114025676',
  INFORMATION: '1244739706',
  ANNOUNCEMENTS: '1344579919',
  SPONSORS: '1444420132',
  PLAYERS: '1544360343',
  NEWS: '1644270554',
};

// Types
export interface Fixture {
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

export interface Team {
  teamId: string;
  teamName: string;
  division: string;
  logoUrl: string;
  description?: string;
  founded?: string;
  captain?: string;
  coach?: string;
}

export interface Player {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  position: string;
  jerseyNumber: string;
  tries: number;
  conversions: number;
  totalPoints: number;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

// Helper function to extract image URL from =IMAGE() formula
function extractImageUrl(formula: string): string {
  if (!formula) return '';
  const match = formula.match(/=IMAGE\(["']([^"']+)["']\)/i);
  return match ? match[1] : formula;
}

// Cache the fetch to avoid redundant requests
const fetchSheetData = cache(async (gid: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
});

// Parse CSV text into array of objects
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Fetch fixtures data
export async function getFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  
  return data.map((row: any) => ({
    date: row.Date || '',
    time: row.Time || '',
    division: row.Division || '',
    homeTeamId: row.HomeTeamID || '',
    homeTeam: row.HomeTeam || '',
    homeScore: row.HomeScore || '',
    awayTeamId: row.AwayTeamID || '',
    awayTeam: row.AwayTeam || '',
    awayScore: row.AwayScore || '',
    venue: row.Venue || '',
    pitch: row.Pitch || '',
    matchType: row.MatchType || '',
    round: row.Round || '',
    completed: row.Completed === 'TRUE' || row.Completed === 'true',
  }));
}

// Alias for backwards compatibility
export const fetchFixtures = getFixtures;

// Fetch teams data with logo support
export async function getTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  
  return data.map((row: any) => ({
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    division: row.Division || '',
    logoUrl: extractImageUrl(row.LOGO || ''),
    description: row.Description || '',
    founded: row.Founded || '',
    captain: row.Captain || '',
    coach: row.Coach || '',
  }));
}

// Fetch single team by ID
export async function fetchTeamById(teamId: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find(t => t.teamId === teamId) || null;
}

// Fetch players data
export async function getPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  
  return data.map((row: any) => ({
    playerId: row.PlayerID || '',
    playerName: row.PlayerName || '',
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    position: row.Position || '',
    jerseyNumber: row.JerseyNumber || '',
    tries: parseInt(row.Tries) || 0,
    conversions: parseInt(row.Conversions) || 0,
    totalPoints: parseInt(row.TotalPoints) || 0,
  }));
}

// Fetch players by team ID
export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.teamId === teamId);
}

// Fetch standings data
export async function getStandings() {
  const data = await fetchSheetData(SHEET_GIDS.STANDINGS);
  
  return data.map((row: any) => ({
    division: row.Division || '',
    position: parseInt(row.Position) || 0,
    team: row.Team || '',
    played: parseInt(row.Played) || 0,
    won: parseInt(row.Won) || 0,
    drawn: parseInt(row.Drawn) || 0,
    lost: parseInt(row.Lost) || 0,
    pointsFor: parseInt(row.PointsFor) || 0,
    pointsAgainst: parseInt(row.PointsAgainst) || 0,
    pointsDifference: parseInt(row.PointsDifference) || 0,
    bonusPoints: parseInt(row.BonusPoints) || 0,
    totalPoints: parseInt(row.TotalPoints) || 0,
  }));
}

// Fetch locations data
export async function getLocations() {
  const data = await fetchSheetData(SHEET_GIDS.LOCATIONS);
  
  return data.map((row: any) => ({
    venue: row.Venue || '',
    address: row.Address || '',
    mapLink: row.MapLink || '',
    directions: row.Directions || '',
    facilities: row.Facilities || '',
  }));
}

// Fetch information data
export async function getInformation() {
  const data = await fetchSheetData(SHEET_GIDS.INFORMATION);
  
  return data.map((row: any) => ({
    category: row.Category || '',
    title: row.Title || '',
    content: row.Content || '',
    order: parseInt(row.Order) || 0,
  }));
}

// Fetch announcements data
export async function getAnnouncements() {
  const data = await fetchSheetData(SHEET_GIDS.ANNOUNCEMENTS);
  
  return data.map((row: any) => ({
    date: row.Date || '',
    title: row.Title || '',
    content: row.Content || '',
    priority: row.Priority || 'normal',
    active: row.Active === 'TRUE' || row.Active === 'true',
  }));
}

// Fetch sponsors data
export async function getSponsors() {
  const data = await fetchSheetData(SHEET_GIDS.SPONSORS);
  
  return data.map((row: any) => ({
    name: row.Name || '',
    logoUrl: extractImageUrl(row.LogoUrl || ''),
    website: row.Website || '',
    tier: row.Tier || '',
    order: parseInt(row.Order) || 0,
  }));
}

// Fetch news data
export async function getNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  
  return data.map((row: any) => ({
    id: row.ID || '',
    slug: row.Slug || '',
    title: row.Title || '',
    content: row.Content || '',
    excerpt: row.Excerpt || '',
    date: row.Date || '',
    author: row.Author || '',
    imageUrl: extractImageUrl(row.ImageUrl || ''),
    category: row.Category || '',
    tags: row.Tags ? row.Tags.split(',').map((t: string) => t.trim()) : [],
  }));
}

// Alias for backwards compatibility
export const fetchNews = getNews;

// Fetch news by slug
export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find(n => n.slug === slug) || null;
}
