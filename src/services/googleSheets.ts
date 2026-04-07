import { cache } from 'react';

// Revalidate every 5 minutes
export const revalidate = 300;

const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

// Sheet GIDs
const SHEET_GIDS = {
  FIXTURES: '0',
  TEAMS: '1275974115',
  LADDER: '1885819712',
  LOCATIONS: '114025676',
  INFORMATION: '1244739706',
  ANNOUNCEMENTS: '1344579919',
  SPONSORS: '1444420132',
  PLAYERS: '1544360343',
  NEWS: '1644270554',
  CONFIG: '1744180765',
};

// Types

// FIXTURES: Date, Day, Time, Field, HomeTeamID, HomeTeam, HomeScore, AwayTeamID, AwayTeam, AwayScore, Division, Round, Status, Notes
export interface Fixture {
  matchId?: string;  // Optional for backwards compatibility
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
  logoUrl: string;      // From LogoURL column (Column G) - direct image URL
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
  region: string;  // Column E - Japan, Hong Kong, Ausasia, etc.
  number: number;  // Jersey number as number for comparison
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
  id?: string;  // Optional alias for articleId
  articleId: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageUrl?: string;  // Optional alias for featuredImage
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

// CONFIG: Key, Value (with additional properties for backwards compatibility)
export interface Config {
  key: string;
  value: string;
  // Additional properties expected by other components
  informationPackUrl?: string;
  venue?: string;
  tournamentDate?: string;
  tournamentName?: string;
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
// FIXTURES: Date, Day, Time, Field, HomeTeamID, HomeTeam, HomeScore, AwayTeamID, AwayTeam, AwayScore, Division, Round, Status, Notes
export async function getFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  
  return data.map((row: any) => ({
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

// Alias for backwards compatibility
export const fetchFixtures = getFixtures;

// Fetch teams data with logo support
// TEAMS: TeamID, TeamName, Division, Region, Captain, Coach, LogoURL, LOGO, ShortCode, Category, Contact, Active, Status, Founded, Website
export async function getTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  
  return data.map((row: any) => ({
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    division: row.Division || '',
    region: row.Region || '',
    captain: row.Captain || '',
    coach: row.Coach || '',
    logoUrl: row.LogoURL || '', // Column G - direct image URL
    shortCode: row.ShortCode || '',
    category: row.Category || '',
    contact: row.Contact || '',
    active: row.Active === 'TRUE' || row.Active === 'true',
    status: row.Status || '',
    founded: row.Founded || '',
    website: row.Website || '',
  }));
}

// Fetch single team by ID
export async function fetchTeamById(teamId: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find(t => t.teamId === teamId) || null;
}

// Alias for backwards compatibility
export const fetchTeams = getTeams;

// Fetch players data
// PLAYERS: PlayerID, TeamID, FullName, TeamName, Region, Number, Position, PhotoURL, PlayersToWatch, Tries, Weight, Nationality, Bio, Status, Debut
export async function getPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  
  return data.map((row: any) => ({
    playerId: row.PlayerID || '',
    teamId: row.TeamID || '',
    fullName: row.FullName || '',
    teamName: row.TeamName || '',
    region: row.Region || '',  // Column E - Japan, Hong Kong, Ausasia, etc.
    number: parseInt(row.Number) || 0,
    position: row.Position || '',
    photoUrl: extractImageUrl(row.PhotoURL || ''),
    playersToWatch: row.PlayersToWatch === 'TRUE' || row.PlayersToWatch === 'true',
    tries: parseInt(row.Tries) || 0,
    weight: row.Weight || '',
    nationality: row.Nationality || '',
    bio: row.Bio || '',
    status: row.Status || '',
    debut: row.Debut || '',
  }));
}

// Fetch players by team ID
export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.teamId === teamId);
}

// Fetch players marked as "Players to Watch"
export async function fetchPlayersToWatch(): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.playersToWatch);
}

// Fetch ladder/standings data
// LADDER: Position, TeamID, TeamName, Division, Played, Won, Drawn, Lost, PointsFor, PointsAgainst, PointsDiff, BonusPoints, TotalPoints, WinPercent, Form
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

// Alias for backwards compatibility
export const getStandings = getLadder;

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
// NEWS: ArticleID, Title, Author, Date, Category, Excerpt, Content, FeaturedImage, GalleryImages, Published, Slug, Tags, Views
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
    featuredImage: extractImageUrl(row.FeaturedImage || ''),
    galleryImages: row.GalleryImages || '',
    published: row.Published === 'TRUE' || row.Published === 'true',
    slug: row.Slug || '',
    tags: row.Tags ? row.Tags.split(',').map((t: string) => t.trim()) : [],
    views: parseInt(row.Views) || 0,
  }));
}

// Alias for backwards compatibility
export const fetchNews = getNews;

// Fetch news by slug
export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find(n => n.slug === slug) || null;
}

// Fetch config data (returns array of key-value pairs)
// CONFIG: Key, Value
export async function getConfig(): Promise<Config[]> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  
  return data.map((row: any) => ({
    key: row.Key || '',
    value: row.Value || '',
  }));
}

// Alias for backwards compatibility
export const fetchConfig = getConfig;

// Fetch config as a single object (for components expecting Config object)
export async function getConfigObject(): Promise<Config> {
  const configArray = await getConfig();
  const configObject: any = {};
  
  configArray.forEach((item: Config) => {
    if (item.key) {
      configObject[item.key] = item.value;
    }
  });
  
  // Add key/value to match Config interface
  configObject.key = 'config';
  configObject.value = 'loaded';
  
  return configObject as Config;
}

// Get a specific config value by key
export async function getConfigValue(key: string): Promise<string> {
  const config = await getConfig();
  const item = config.find(c => c.key === key);
  return item?.value || '';
}

  TEAMS: '1275974115',
  LADDER: '1885819712',
  LOCATIONS: '114025676',
  INFORMATION: '1244739706',
  ANNOUNCEMENTS: '1344579919',
  SPONSORS: '1444420132',
  PLAYERS: '1544360343',
  NEWS: '1644270554',
  CONFIG: '1744180765',
};

// Types

// FIXTURES: Date, Day, Time, Field, HomeTeamID, HomeTeam, HomeScore, AwayTeamID, AwayTeam, AwayScore, Division, Round, Status, Notes
export interface Fixture {
  matchId?: string;  // Optional for backwards compatibility
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
  logoUrl: string;      // From LogoURL column (Column G) - direct image URL
  shortCode: string;
  category: string;
  contact: string;
  active: boolean;
  status: string;
  founded: string;
  website: string;
}

// PLAYERS: PlayerID, TeamID, FullName, TeamName, Country, Number, Position, PhotoURL, PlayersToWatch, Tries, Weight, Nationality, Bio, Status, Debut
export interface Player {
  playerId: string;
  teamId: string;
  fullName: string;
  teamName: string;
  country: string;
  number: number;  // Jersey number as number for comparison
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
  id?: string;  // Optional alias for articleId
  articleId: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageUrl?: string;  // Optional alias for featuredImage
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

// CONFIG: Key, Value (with additional properties for backwards compatibility)
export interface Config {
  key: string;
  value: string;
  // Additional properties expected by other components
  informationPackUrl?: string;
  venue?: string;
  tournamentDate?: string;
  tournamentName?: string;
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
// FIXTURES: Date, Day, Time, Field, HomeTeamID, HomeTeam, HomeScore, AwayTeamID, AwayTeam, AwayScore, Division, Round, Status, Notes
export async function getFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  
  return data.map((row: any) => ({
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

// Alias for backwards compatibility
export const fetchFixtures = getFixtures;

// Fetch teams data with logo support
// TEAMS: TeamID, TeamName, Division, Region, Captain, Coach, LogoURL, LOGO, ShortCode, Category, Contact, Active, Status, Founded, Website
export async function getTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  
  return data.map((row: any) => ({
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    division: row.Division || '',
    region: row.Region || '',
    captain: row.Captain || '',
    coach: row.Coach || '',
    logoUrl: row.LogoURL || '', // Column G - direct image URL
    shortCode: row.ShortCode || '',
    category: row.Category || '',
    contact: row.Contact || '',
    active: row.Active === 'TRUE' || row.Active === 'true',
    status: row.Status || '',
    founded: row.Founded || '',
    website: row.Website || '',
  }));
}

// Fetch single team by ID
export async function fetchTeamById(teamId: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find(t => t.teamId === teamId) || null;
}

// Alias for backwards compatibility
export const fetchTeams = getTeams;

// Fetch players data
// PLAYERS: PlayerID, TeamID, FullName, TeamName, Country, Number, Position, PhotoURL, PlayersToWatch, Tries, Weight, Nationality, Bio, Status, Debut
export async function getPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  
  return data.map((row: any) => ({
    playerId: row.PlayerID || '',
    teamId: row.TeamID || '',
    fullName: row.FullName || '',
    teamName: row.TeamName || '',
    country: row.Country || '',
    number: parseInt(row.Number) || 0,
    position: row.Position || '',
    photoUrl: extractImageUrl(row.PhotoURL || ''),
    playersToWatch: row.PlayersToWatch === 'TRUE' || row.PlayersToWatch === 'true',
    tries: parseInt(row.Tries) || 0,
    weight: row.Weight || '',
    nationality: row.Nationality || '',
    bio: row.Bio || '',
    status: row.Status || '',
    debut: row.Debut || '',
  }));
}

// Fetch players by team ID
export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.teamId === teamId);
}

// Fetch players marked as "Players to Watch"
export async function fetchPlayersToWatch(): Promise<Player[]> {
  const players = await getPlayers();
  return players.filter(p => p.playersToWatch);
}

// Fetch ladder/standings data
// LADDER: Position, TeamID, TeamName, Division, Played, Won, Drawn, Lost, PointsFor, PointsAgainst, PointsDiff, BonusPoints, TotalPoints, WinPercent, Form
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

// Alias for backwards compatibility
export const getStandings = getLadder;

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
// NEWS: ArticleID, Title, Author, Date, Category, Excerpt, Content, FeaturedImage, GalleryImages, Published, Slug, Tags, Views
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
    featuredImage: extractImageUrl(row.FeaturedImage || ''),
    galleryImages: row.GalleryImages || '',
    published: row.Published === 'TRUE' || row.Published === 'true',
    slug: row.Slug || '',
    tags: row.Tags ? row.Tags.split(',').map((t: string) => t.trim()) : [],
    views: parseInt(row.Views) || 0,
  }));
}

// Alias for backwards compatibility
export const fetchNews = getNews;

// Fetch news by slug
export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find(n => n.slug === slug) || null;
}

// Fetch config data (returns array of key-value pairs)
// CONFIG: Key, Value
export async function getConfig(): Promise<Config[]> {
  const data = await fetchSheetData(SHEET_GIDS.CONFIG);
  
  return data.map((row: any) => ({
    key: row.Key || '',
    value: row.Value || '',
  }));
}

// Alias for backwards compatibility
export const fetchConfig = getConfig;

// Fetch config as a single object (for components expecting Config object)
export async function getConfigObject(): Promise<Config> {
  const configArray = await getConfig();
  const configObject: any = {};
  
  configArray.forEach((item: Config) => {
    if (item.key) {
      configObject[item.key] = item.value;
    }
  });
  
  // Add key/value to match Config interface
  configObject.key = 'config';
  configObject.value = 'loaded';
  
  return configObject as Config;
}

// Get a specific config value by key
export async function getConfigValue(key: string): Promise<string> {
  const config = await getConfig();
  const item = config.find(c => c.key === key);
  return item?.value || '';
}
