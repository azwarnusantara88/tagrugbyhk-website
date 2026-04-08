const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

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
// INTERFACES - Matching Your Google Sheet Structure
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
  homeScore: number;
  awayTeamId: string;
  awayTeam: string;
  awayScore: number;
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
  informationPackUrl: string;
  tournamentName: string;
  tournamentDate: string;
  venue: string;
  websiteUrl?: string;
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

// Extract image URL from =IMAGE() formula
function extractImageUrl(formula: string): string {
  if (!formula) return '';
  const match = formula.match(/=IMAGE\(["']([^"']+)["']\)/i);
  return match ? match[1] : formula;
}

// ============================================
// FETCH FUNCTIONS - Matching Your Column Structure
// ============================================

// FIXTURES: MatchID(0), Date(1), Day(2), Time(3), Field(4), HomeTeamID(5), HomeTeam(6), HomeScore(7), AwayTeamID(8), AwayTeam(9), AwayScore(10), Division(11), Round(12), Status(13), Notes(14)
export async function fetchFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    matchId: row[0] || '',
    date: row[1] || '',
    day: row[2] || '',
    time: row[3] || '',
    field: row[4] || '',
    homeTeamId: row[5] || '',
    homeTeam: row[6] || '',
    homeScore: parseInt(row[7]) || 0,
    awayTeamId: row[8] || '',
    awayTeam: row[9] || '',
    awayScore: parseInt(row[10]) || 0,
    division: row[11] || '',
    round: row[12] || '',
    status: row[13] || '',
    notes: row[14] || '',
  }));
}

// Alias for compatibility
export const getFixtures = fetchFixtures;

// TEAMS: TeamID(0), TeamName(1), Division(2), Region(3), Captain(4), Coach(5), LogoURL(6), LOGO(7), ShortCode(8), Category(9), Contact(10), Active(11), Status(12), Founded(13), Website(14)
export async function fetchTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    teamId: row[0] || '',
    teamName: row[1] || '',
    division: row[2] || '',
    region: row[3] || '',
    captain: row[4] || '',
    coach: row[5] || '',
    // Column G (index 6) LogoURL - convert Google Drive links
    logoUrl: convertGoogleDriveUrl(row[6] || ''),
    shortCode: row[8] || '',
    category: row[9] || '',
    contact: row[10] || '',
    active: row[11]?.toUpperCase() === 'TRUE',
    status: row[12] || '',
    founded: row[13] || '',
    website: row[14] || '',
  }));
}

// Alias for compatibility
export const getTeams = fetchTeams;

// PLAYERS: PlayerID(0), TeamID(1), FullName(2), TeamName(3), Region(4), Number(5), Position(6), PhotoURL(7), PlayersToWatch(8), Tries(9), Weight(10), Nationality(11), Bio(12), Status(13), Debut(14)
export async function fetchPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    playerId: row[0] || '',
    teamId: row[1] || '',
    fullName: row[2] || '',
    teamName: row[3] || '',
    region: row[4] || '',
    number: parseInt(row[5]) || 0,
    position: row[6] || '',
    photoUrl: convertGoogleDriveUrl(row[7] || ''),
    playersToWatch: row[8]?.toUpperCase() === 'TRUE',
    tries: parseInt(row[9]) || 0,
    weight: row[10] || '',
    nationality: row[11] || '',
    bio: row[12] || '',
    status: row[13] || '',
    debut: row[14] || '',
  }));
}

export async function fetchPlayersToWatch(): Promise<Player[]> {
  const allPlayers = await fetchPlayers();
  return allPlayers.filter(player => player.playersToWatch);
}

// NEWS: ArticleID(0), Title(1), Author(2), Date(3), Category(4), Excerpt(5), Content(6), FeaturedImage(7), GalleryImages(8), Published(9), Slug(10), Tags(11), Views(12)
export async function fetchNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    articleId: row[0] || '',
    title: row[1] || '',
    author: row[2] || '',
    date: row[3] || '',
    category: row[4] || '',
    excerpt: row[5] || '',
    content: row[6] || '',
    featuredImage: convertGoogleDriveUrl(row[7] || ''),
    galleryImages: row[8] || '',
    published: row[9]?.toUpperCase() === 'TRUE',
    slug: row[10] || '',
    tags: row[11] ? row[11].split(',').map((t: string) => t.trim()) : [],
    views: parseInt(row[12]) || 0,
  }));
}

// LADDER: Position(0), TeamID(1), TeamName(2), Division(3), Played(4), Won(5), Drawn(6), Lost(7), PointsFor(8), PointsAgainst(9), PointsDiff(10), BonusPoints(11), TotalPoints(12), WinPercent(13), Form(14)
export async function fetchStandings(): Promise<LadderStanding[]> {
  const data = await fetchSheetData(SHEET_GIDS.LADDER);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    position: parseInt(row[0]) || 0,
    teamId: row[1] || '',
    teamName: row[2] || '',
    division: row[3] || '',
    played: parseInt(row[4]) || 0,
    won: parseInt(row[5]) || 0,
    drawn: parseInt(row[6]) || 0,
    lost: parseInt(row[7]) || 0,
    pointsFor: parseInt(row[8]) || 0,
    pointsAgainst: parseInt(row[9]) || 0,
    pointsDiff: parseInt(row[10]) || 0,
    bonusPoints: parseInt(row[11]) || 0,
    totalPoints: parseInt(row[12]) || 0,
    winPercent: parseFloat(row[13]) || 0,
    form: row[14] || '',
  }));
}

// Alias for compatibility
export const getLadder = fetchStandings;

// CONFIG: Key(0), Value(1)
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
    const key = row[0]?.toLowerCase().replace(/\s/g, '');
    const value = row[1] || '';
    
    switch (key) {
      case 'informationpackurl':
      case 'informationpack':
        config.informationPackUrl = value;
        break;
      case 'tournamentname':
        config.tournamentName = value;
        break;
      case 'tournamentdate':
      case 'eventdate':
        config.tournamentDate = value;
        break;
      case 'venue':
      case 'location':
        config.venue = value;
        break;
      case 'websiteurl':
        config.websiteUrl = value;
        break;
      case 'registrationopen':
        config.registrationOpen = value;
        break;
      case 'registrationdeadline':
        config.registrationDeadline = value;
        break;
      case 'contactemail':
        config.contactEmail = value;
        break;
      case 'contactphone':
        config.contactPhone = value;
        break;
      case 'socialinstagram':
        config.socialInstagram = value;
        break;
      case 'socialfacebook':
        config.socialFacebook = value;
        break;
      case 'socialyoutube':
        config.socialYouTube = value;
        break;
      case 'socialtwitter':
        config.socialTwitter = value;
        break;
    }
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

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await fetchNews();
  return news.find(item => item.slug === slug) || null;
}

export async function fetchFixturesByTeam(teamId: string): Promise<Fixture[]> {
  const fixtures = await fetchFixtures();
  return fixtures.filter(
    f => f.homeTeamId === teamId || f.awayTeamId === teamId
  );
}

/**
 * Get team logo URL by TeamID
 * Used by FixturesSection to display team logos
 */
export async function getTeamLogo(teamId: string): Promise<string> {
  if (!teamId) return '';
  const team = await fetchTeamById(teamId);
  return team?.logoUrl || '';
}
