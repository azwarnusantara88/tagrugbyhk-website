import { cache } from 'react';

// Revalidate every 5 minutes
export const revalidate = 300;

const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

// Sheet GIDs - UPDATED WITH CORRECT IDs
const SHEET_GIDS = {
  FIXTURES: '0',
  TEAMS: '1275974115',
  PLAYERS: '652663105',
  NEWS: '1320981095',
  LADDER: '397145122',
  CONFIG: '446704132',
  DATA: '104865886',
};

// ============================================
// TYPES
// ============================================

// FIXTURES: MatchID, Date, Day, Time, Field, HomeTeamID, HomeTeam, HomeScore, AwayTeamID, AwayTeam, AwayScore, Division, Round, Status, Notes
export interface Fixture {
  matchId: string;
  date: string;
  day: string;
  time: string;
  field: string;
  homeTeamId: string;
  homeTeam: string;
  homeScore: string;
  awayTeamId: string;
  awayTeam: string;
  awayScore: string;
  division: string;
  round: string;
  status: string;
  notes: string;
}

// TEAMS: TeamID, TeamName, Division, Region, Captain, Coach, LogoURL, LOGO, ShortCode, Category, Contact, Active, Status, Founded, Website
export interface Team {
  teamId: string;
  teamName: string;
  division: string;
  region: string;
  captain: string;
  coach: string;
  logoUrl: string;
  shortCode: string;
  category: string;
  contact: string;
  active: boolean;
  status: string;
  founded: string;
  website: string;
}

// PLAYERS: PlayerID, TeamID, FullName, TeamName, Region, Number, Position, PhotoURL, PlayersToWatch, Tries, Weight, Nationality, Bio, Status, Debut
export interface Player {
  playerId: string;
  teamId: string;
  fullName: string;
  teamName: string;
  region: string;
  number: number;
  position: string;
  photoUrl: string;
  playersToWatch: boolean;
  tries: number;
  weight: string;
  nationality: string;
  bio: string;
  status: string;
  debut: string;
}

// NEWS: ArticleID, Title, Author, Date, Category, Excerpt, Content, FeaturedImage, GalleryImages, Published, Slug, Tags, Views
export interface NewsItem {
  articleId: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  galleryImages: string;
  published: boolean;
  slug: string;
  tags: string[];
  views: number;
}

// LADDER: Position, TeamID, TeamName, Division, Played, Won, Drawn, Lost, PointsFor, PointsAgainst, PointsDiff, BonusPoints, TotalPoints, WinPercent, Form
export interface LadderStanding {
  position: number;
  teamId: string;
  teamName: string;
  division: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  bonusPoints: number;
  totalPoints: number;
  winPercent: number;
  form: string;
}

// CONFIG: Key, Value
export interface Config {
  key: string;
  value: string;
  // Additional properties that components expect
  informationPackUrl?: string;
  venue?: string;
  tournamentDate?: string;
  tournamentName?: string;
  websiteUrl?: string;
  location?: string;
  eventDate?: string;
  registrationOpen?: string;
  registrationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialYouTube?: string;
  socialTwitter?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Converts Google Drive sharing links to direct image URLs
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

/**
 * Extract image URL from =IMAGE() formula
 */
function extractImageUrl(formula: string): string {
  if (!formula) return '';
  const match = formula.match(/=IMAGE\(["']([^"']+)["']\)/i);
  return match ? match[1] : formula;
}

// ============================================
// CSV PARSING
// ============================================

const fetchSheetData = cache(async (gid: string) => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  try {
    const response = await fetch(url);
    
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

// ============================================
// FETCH FUNCTIONS
// ============================================

// Fetch fixtures data
export async function getFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  
  return data.map((row: any) => ({
    matchId: row.MatchID || '',
    date: row.Date || '',
    day: row.Day || '',
    time: row.Time || '',
    field: row.Field || '',
    homeTeamId: row.HomeTeamID || '',
    homeTeam: row.HomeTeam || '',
    homeScore: row.HomeScore || '',
    awayTeamId: row.AwayTeamID || '',
    awayTeam: row.AwayTeam || '',
    awayScore: row.AwayScore || '',
    division: row.Division || '',
    round: row.Round || '',
    status: row.Status || '',
    notes: row.Notes || '',
  }));
}

export const fetchFixtures = getFixtures;

// Fetch teams data
export async function getTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  
  return data.map((row: any) => ({
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    division: row.Division || '',
    region: row.Region || '',
    captain: row.Captain || '',
    coach: row.Coach || '',
    logoUrl: convertGoogleDriveUrl(row.LogoURL || ''),
    shortCode: row.ShortCode || '',
    category: row.Category || '',
    contact: row.Contact || '',
    active: row.Active === 'TRUE' || row.Active === 'true',
    status: row.Status || '',
    founded: row.Founded || '',
    website: row.Website || '',
  }));
}

export const fetchTeams = getTeams;

export async function fetchTeamById(teamId: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find(t => t.teamId === teamId) || null;
}

// Fetch players data
export async function getPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  
  return data.map((row: any) => ({
    playerId: row.PlayerID || '',
    teamId: row.TeamID || '',
    fullName: row.FullName || '',
    teamName: row.TeamName || '',
    region: row.Region || '',
    number: parseInt(row.Number) || 0,
    position: row.Position || '',
    photoUrl: convertGoogleDriveUrl(row.PhotoURL || ''),
    playersToWatch: row.PlayersToWatch === 'TRUE' || row.PlayersToWatch === 'true',
    tries: parseInt(row.Tries) || 0,
    weight: row.Weight || '',
    nationality: row.Nationality || '',
    bio: row.Bio || '',
    status: row.Status || '',
    debut: row.Debut || '',
  }));
}

export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.teamId === teamId);
}

export async function fetchPlayersToWatch(): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.playersToWatch);
}

// Fetch ladder/standings data
export async function getLadder(): Promise<LadderStanding[]> {
  const data = await fetchSheetData(SHEET_GIDS.LADDER);
  
  return data.map((row: any) => ({
    position: parseInt(row.Position) || 0,
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    division: row.Division || '',
    played: parseInt(row.Played) || 0,
    won: parseInt(row.Won) || 0,
    drawn: parseInt(row.Drawn) || 0,
    lost: parseInt(row.Lost) || 0,
    pointsFor: parseInt(row.PointsFor) || 0,
    pointsAgainst: parseInt(row.PointsAgainst) || 0,
    pointsDiff: parseInt(row.PointsDiff) || 0,
    bonusPoints: parseInt(row.BonusPoints) || 0,
    totalPoints: parseInt(row.TotalPoints) || 0,
    winPercent: parseFloat(row.WinPercent) || 0,
    form: row.Form || '',
  }));
}

export const getStandings = getLadder;

// Fetch news data
export async function getNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  
  return data.map((row: any) => ({
    articleId: row.ArticleID || '',
    title: row.Title || '',
    author: row.Author || '',
    date: row.Date || '',
    category: row.Category || '',
    excerpt: row.Excerpt || '',
    content: row.Content || '',
    featuredImage: convertGoogleDriveUrl(row.FeaturedImage || ''),
    galleryImages: row.GalleryImages || '',
    published: row.Published === 'TRUE' || row.Published === 'true',
    slug: row.Slug || '',
    tags: row.Tags ? row.Tags.split(',').map((t: string) => t.trim()) : [],
    views: parseInt(row.Views) || 0,
  }));
}

export const fetchNews = getNews;

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find(n => n.slug === slug) || null;
}

// ============================================
// CONFIG FUNCTIONS - FIXED FOR TournamentOverview.tsx
// ============================================

/**
 * Fetch config as array of key-value pairs
 */
export async function getConfig(): Promise<Config[]> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  
  return data.map((row: any) => ({
    key: row.Key || '',
    value: row.Value || '',
  }));
}

/**
 * Fetch config as a single Config object
 * This is what TournamentOverview.tsx expects
 */
export async function fetchConfig(): Promise<Config> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  const config: Config = {
    key: 'config',
    value: 'loaded',
    informationPackUrl: '',
    tournamentName: 'Tag Asia Cup 2026',
    tournamentDate: 'April 11-12, 2026',
    venue: 'J-Green Sakai City',
    websiteUrl: '',
    location: '',
    eventDate: '',
    registrationOpen: '',
    registrationDeadline: '',
    contactEmail: '',
    contactPhone: '',
    socialInstagram: '',
    socialFacebook: '',
    socialYouTube: '',
    socialTwitter: '',
  };
  
  data.forEach((row: any) => {
    const key = row.Key || '';
    const value = row.Value || '';
    
    // Map common config keys to Config properties
    switch (key) {
      case 'TournamentName':
      case 'tournamentName':
        config.tournamentName = value;
        break;
      case 'EventDate':
      case 'eventDate':
      case 'tournamentDate':
        config.tournamentDate = value;
        config.eventDate = value;
        break;
      case 'Location':
      case 'location':
      case 'venue':
        config.venue = value;
        config.location = value;
        break;
      case 'WebsiteURL':
      case 'websiteUrl':
        config.websiteUrl = value;
        break;
      case 'InformationPack':
      case 'informationPackUrl':
        config.informationPackUrl = value;
        break;
      case 'RegistrationOpen':
      case 'registrationOpen':
        config.registrationOpen = value;
        break;
      case 'RegistrationDeadline':
      case 'registrationDeadline':
        config.registrationDeadline = value;
        break;
      case 'ContactEmail':
      case 'contactEmail':
        config.contactEmail = value;
        break;
      case 'ContactPhone':
      case 'contactPhone':
        config.contactPhone = value;
        break;
      case 'SocialInstagram':
      case 'socialInstagram':
        config.socialInstagram = value;
        break;
      case 'SocialFacebook':
      case 'socialFacebook':
        config.socialFacebook = value;
        break;
      case 'SocialYouTube':
      case 'socialYouTube':
        config.socialYouTube = value;
        break;
      case 'SocialTwitter':
      case 'socialTwitter':
        config.socialTwitter = value;
        break;
      default:
        // Store any other keys dynamically
        (config as any)[key] = value;
    }
  });
  
  return config;
}

/**
 * Get a specific config value by key
 */
export async function getConfigValue(key: string): Promise<string> {
  const config = await getConfig();
  const item = config.find(c => c.key === key);
  return item?.value || '';
}
