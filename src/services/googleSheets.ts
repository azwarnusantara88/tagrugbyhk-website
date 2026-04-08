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
// INTERFACES - Match Your Google Sheet Exactly
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
  status: 'SCHEDULED' | 'LIVE' | 'FINAL' | string;
  notes: string;
}

// TEAMS: TeamID, TeamName, Division, Region, Captain, Coach, LogoURL, LOGO, ShortCode, Category, Contact, Active, Status, Founded, Website
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
}

// NEWS: ArticleID, Title, Author, Date, Category, Excerpt, Content, FeaturedImage, GalleryImages, Published, Slug, Tags, Views
export interface NewsItem {
  articleId: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageUrl: string;
  galleryImages: string;
  published: boolean;
  tags: string[];
  views: number;
}

// LADDER: Position, TeamID, TeamName, Division, Played, Won, Drawn, Lost, PointsFor, PointsAgainst, PointsDiff, BonusPoints, TotalPoints, WinPercent, Form
export interface Standing {
  position: number;
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
}

// CONFIG: Key, Value
export interface Config {
  informationPackUrl: string;
  tournamentName: string;
  tournamentDate: string;
  venue: string;
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

// ============================================
// FETCH FUNCTIONS
// ============================================

// FIXTURES
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
    status: (row[13] as 'SCHEDULED' | 'LIVE' | 'FINAL') || 'SCHEDULED',
    notes: row[14] || '',
  }));
}

export const getFixtures = fetchFixtures;

// TEAMS
export async function fetchTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    teamId: row[0] || '',
    teamName: row[1] || '',
    division: row[2] || '',
    region: row[3] || '',
    captain: row[4] || '',
    logoUrl: row[6] || '',
    wins: 0,
    losses: 0,
    points: 0,
  }));
}

export const getTeams = fetchTeams;

// PLAYERS
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
    photoUrl: row[7] || '',
    playersToWatch: row[8]?.toUpperCase() === 'TRUE',
  }));
}

export async function fetchPlayersToWatch(): Promise<Player[]> {
  const allPlayers = await fetchPlayers();
  return allPlayers.filter(player => player.playersToWatch);
}

// NEWS
export async function fetchNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  if (data.length < 2) return [];
  return data.slice(1).map(row => {
    const featuredImage = row[7] || '';
    return {
      articleId: row[0] || '',
      slug: row[10] || '',
      title: row[1] || '',
      author: row[2] || '',
      date: row[3] || '',
      category: row[4] || '',
      excerpt: row[5] || '',
      content: row[6] || '',
      featuredImage: featuredImage,
      imageUrl: featuredImage,
      galleryImages: row[8] || '',
      published: row[9]?.toUpperCase() === 'TRUE',
      tags: row[11] ? row[11].split(',').map((t: string) => t.trim()) : [],
      views: parseInt(row[12]) || 0,
    };
  });
}

export const getNews = fetchNews;

// LADDER
export async function fetchStandings(): Promise<Standing[]> {
  const data = await fetchSheetData(SHEET_GIDS.LADDER);
  if (data.length < 2) return [];
  return data.slice(1).map(row => ({
    position: parseInt(row[0]) || 0,
    teamId: row[1] || '',
    teamName: row[2] || '',
    division: row[3] || '',
    played: parseInt(row[4]) || 0,
    won: parseInt(row[5]) || 0,
    lost: parseInt(row[7]) || 0,
    pointsFor: parseInt(row[8]) || 0,
    pointsAgainst: parseInt(row[9]) || 0,
    pointsDiff: parseInt(row[10]) || 0,
    totalPoints: parseInt(row[12]) || 0,
  }));
}

export const getLadder = fetchStandings;

// CONFIG
export async function fetchConfig(): Promise<Config> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  const config: Config = {
    informationPackUrl: '',
    tournamentName: 'Tag Asia Cup 2026',
    tournamentDate: 'April 11-12 2026',
    venue: 'J-Green Sakai Osaka',
  };
  if (data.length < 2) return config;
  data.slice(1).forEach(row => {
    const key = row[0]?.toLowerCase().replace(/\s/g, '');
    if (key === 'informationpackurl' || key === 'informationpack') config.informationPackUrl = row[1] || '';
    if (key === 'tournamentname') config.tournamentName = row[1] || '';
    if (key === 'tournamentdate' || key === 'eventdate') config.tournamentDate = row[1] || '';
    if (key === 'venue' || key === 'location') config.venue = row[1] || '';
  });
  return config;
}

export const getConfig = fetchConfig;

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

export async function getTeamLogo(teamId: string): Promise<string> {
  if (!teamId) return '';
  const team = await fetchTeamById(teamId);
  return team?.logoUrl || '';
}
