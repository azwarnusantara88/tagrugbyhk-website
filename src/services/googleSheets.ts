// Google Sheets Service - Matches Tag Asia Cup 2026 Sheet Structure
// Sheet ID: 1SagsLUTo1UvvgsrGuZqd_YftctlKN5NMi9_1K-tBsHs

const SHEET_ID = '1SagsLUTo1UvvgsrGuZqd_YftctlKN5NMi9_1K-tBsHs';

const SHEET_GIDS = {
  COVER: '903483924',
  TEAMS: '1773916879',
  FIXTURES: '426231149',
  LADDER: '1095999969',
  PLAYERS: '1609704544',
  NEWS: '244646710',
  CONFIG: '547146341',
  DASHBOARD: '755669495',
};

// Cache for sheet data
const CACHE: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface Config {
  tournamentName: string;
  eventDate: string;
  location: string;
  websiteUrl: string;
  informationPack: string;
  registrationOpen: boolean;
  registrationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYouTube: string;
  socialTwitter: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  division: string;
  region: string;
  captain: string;
  coach: string;
  logoUrl: string;
  logo: string;
  shortCode: string;
  category: string;
  contact: string;
  active: boolean;
  status: string;
  founded: string;
  website: string;
}

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
  weight: number;
  nationality: string;
  bio: string;
  status: string;
  debut: string;
}

export interface NewsArticle {
  articleId: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  galleryImages: string[];
  published: boolean;
  slug: string;
  tags: string[];
  views: number;
}

export interface Standing {
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
  winPercent: string;
  form: string;
}

// Parse CSV line with proper quote handling
const parseCSVLine = (line: string): string[] => {
  const cells: string[] = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        cell += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
};

const fetchSheetFromBrowser = async (gid: string): Promise<string[][]> => {
  const cacheKey = gid;
  const now = Date.now();
  
  // Check cache first
  if (CACHE[cacheKey] && now - CACHE[cacheKey].timestamp < CACHE_DURATION) {
    console.log('Using cached data for gid:', gid);
    return CACHE[cacheKey].data;
  }

  try {
    // Use Google Sheets CSV export (no API key needed!)
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
    
    const csvText = await response.text();
    
    // Parse CSV
    const rows: string[][] = csvText
      .split('\n')
      .filter(line => line.trim())
      .map(parseCSVLine);
    
    // Cache the result
    CACHE[cacheKey] = { data: rows, timestamp: now };
    console.log('Fetched and cached', rows.length, 'rows for gid:', gid);
    
    return rows;
  } catch (error) {
    console.error('Error fetching sheet:', error);
    // Return cached data if available, even if expired
    if (CACHE[cacheKey]) {
      console.log('Using expired cache for gid:', gid);
      return CACHE[cacheKey].data;
    }
    throw error;
  }
};

export const fetchConfig = async (): Promise<Config> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.CONFIG);
    console.log('Fetched config from Google Sheets:', rows.length, 'rows');

    const config: Record<string, string> = {};

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length >= 2) {
        const key = row[0]?.trim();
        const value = row[1]?.trim();
        if (key) {
          config[key] = value;
        }
      }
    }

    return {
      tournamentName: config['TournamentName'] || 'TAG Asia Cup 2026',
      eventDate: config['EventDate'] || 'November 15-16, 2026',
      location: config['Location'] || 'Hong Kong',
      websiteUrl: config['WebsiteUrl'] || 'https://tagrugbyhk.org',
      informationPack: config['InformationPack'] || '',
      registrationOpen: config['RegistrationOpen']?.toUpperCase() === 'TRUE',
      registrationDeadline: config['RegistrationDeadline'] || '',
      contactEmail: config['ContactEmail'] || '',
      contactPhone: config['ContactPhone'] || '',
      socialInstagram: config['SocialInstagram'] || '',
      socialFacebook: config['SocialFacebook'] || '',
      socialYouTube: config['SocialYouTube'] || '',
      socialTwitter: config['SocialTwitter'] || '',
    };
  } catch (err) {
    console.warn('Failed to fetch config from Google Sheets:', err);
    return {
      tournamentName: 'TAG Asia Cup 2026',
      eventDate: 'November 15-16, 2026',
      location: 'Hong Kong',
      websiteUrl: 'https://tagrugbyhk.org',
      informationPack: '',
      registrationOpen: false,
      registrationDeadline: '',
      contactEmail: '',
      contactPhone: '',
      socialInstagram: '',
      socialFacebook: '',
      socialYouTube: '',
      socialTwitter: '',
    };
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.TEAMS);
    console.log('Fetched teams from Google Sheets:', rows.length, 'rows');

    const teams: Team[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 5) continue;

      const teamId = row[0]?.trim();
      if (!teamId) continue;

      teams.push({
        teamId: teamId,
        teamName: row[1] || '',
        division: row[2] || '',
        region: row[3] || '',
        captain: row[4] || '',
        coach: row[5] || '',
        logoUrl: row[6] || '',
        logo: row[7] || '',
        shortCode: row[8] || '',
        category: row[9] || '',
        contact: row[10] || '',
        active: row[11]?.toUpperCase() === 'TRUE',
        status: row[12] || 'Active',
        founded: row[13] || '',
        website: row[14] || '',
      });
    }

    console.log('Successfully loaded', teams.length, 'teams from Google Sheets');
    return teams;
  } catch (err) {
    console.warn('Failed to fetch teams from Google Sheets:', err);
    return [];
  }
};

export const fetchTeamById = async (teamId: string): Promise<Team | null> => {
  const teams = await fetchTeams();
  return teams.find(t => t.teamId === teamId) || null;
};

export const fetchFixtures = async (): Promise<Fixture[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.FIXTURES);
    console.log('Fetched fixtures from Google Sheets:', rows.length, 'rows');

    const fixtures: Fixture[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 5) continue;

      const matchId = row[0]?.trim();
      if (!matchId) continue;

      fixtures.push({
        matchId: matchId,
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
      });
    }

    console.log('Successfully loaded', fixtures.length, 'fixtures from Google Sheets');
    return fixtures;
  } catch (err) {
    console.warn('Failed to fetch fixtures from Google Sheets:', err);
    return [];
  }
};

export const fetchPlayers = async (teamId?: string): Promise<Player[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.PLAYERS);
    console.log('Fetched players from Google Sheets:', rows.length, 'rows');

    const players: Player[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 3) continue;

      const playerId = row[0]?.trim();
      if (!playerId) continue;

      const playerTeamId = row[1]?.trim();

      if (teamId && playerTeamId !== teamId) {
        continue;
      }

      players.push({
        playerId: playerId,
        teamId: playerTeamId,
        fullName: row[2] || '',
        teamName: row[3] || '',
        region: row[4] || '',
        number: parseInt(row[5]) || 0,
        position: row[6] || '',
        photoUrl: row[7] || '',
        playersToWatch: row[8]?.toUpperCase() === 'TRUE',
        tries: parseInt(row[9]) || 0,
        weight: parseInt(row[10]) || 0,
        nationality: row[11] || '',
        bio: row[12] || '',
        status: row[13] || 'Active',
        debut: row[14] || '',
      });
    }

    console.log('Successfully loaded', players.length, 'players from Google Sheets');
    return players;
  } catch (err) {
    console.warn('Failed to fetch players from Google Sheets:', err);
    return [];
  }
};

export const fetchPlayersToWatch = async (): Promise<Player[]> => {
  const allPlayers = await fetchPlayers();
  return allPlayers.filter(p => p.playersToWatch);
};

export const fetchPlayersByTeam = fetchPlayers;

export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.NEWS);
    console.log('Fetched news from Google Sheets:', rows.length, 'rows');

    const articles: NewsArticle[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 5) continue;

      const articleId = row[0]?.trim();
      if (!articleId) continue;

      const galleryImagesStr = row[8] || '';
      const galleryImages = galleryImagesStr
        ? galleryImagesStr.split(';').map((img: string) => img.trim()).filter(Boolean)
        : [];

      const tagsStr = row[11] || '';
      const tags = tagsStr
        ? tagsStr.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

      articles.push({
        articleId: articleId,
        title: row[1] || '',
        author: row[2] || '',
        date: row[3] || '',
        category: row[4] || '',
        excerpt: row[5] || '',
        content: row[6] || '',
        featuredImage: row[7] || '',
        galleryImages: galleryImages,
        published: row[9]?.toUpperCase() === 'TRUE',
        slug: row[10] || '',
        tags: tags,
        views: parseInt(row[12]) || 0,
      });
    }

    const publishedArticles = articles.filter(a => a.published);

    console.log('Successfully loaded', publishedArticles.length, 'published articles from Google Sheets');
    return publishedArticles;
  } catch (err) {
    console.warn('Failed to fetch news from Google Sheets:', err);
    return [];
  }
};

export const fetchNewsBySlug = async (slug: string): Promise<NewsArticle | null> => {
  const articles = await fetchNews();
  return articles.find(a => a.slug === slug) || null;
};

export const fetchStandings = async (division?: string): Promise<Standing[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.LADDER);
    console.log('Fetched standings from Google Sheets:', rows.length, 'rows');

    const standings: Standing[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 5) continue;

      const teamId = row[1]?.trim();
      if (!teamId) continue;

      const standingDivision = row[3] || '';

      if (division && standingDivision !== division) {
        continue;
      }

      standings.push({
        position: parseInt(row[0]) || 0,
        teamId: teamId,
        teamName: row[2] || '',
        division: standingDivision,
        played: parseInt(row[4]) || 0,
        won: parseInt(row[5]) || 0,
        drawn: parseInt(row[6]) || 0,
        lost: parseInt(row[7]) || 0,
        pointsFor: parseInt(row[8]) || 0,
        pointsAgainst: parseInt(row[9]) || 0,
        pointsDiff: parseInt(row[10]) || 0,
        bonusPoints: parseInt(row[11]) || 0,
        totalPoints: parseInt(row[12]) || 0,
        winPercent: row[13] || '0%',
        form: row[14] || '',
      });
    }

    console.log('Successfully loaded', standings.length, 'standings from Google Sheets');
    return standings;
  } catch (err) {
    console.warn('Failed to fetch standings from Google Sheets:', err);
    return [];
  }
};

export const getLadder = fetchStandings;
export const fetchLadder = fetchStandings;

export { fetchFixtures as getFixtures };
export { fetchTeams as getTeams };
export { fetchNews as getNews };
export { fetchConfig as getConfig };

// Division styling helper
export const getDivisionStyle = (division: string): { bg: string; text: string; border: string } => {
  const divisionLower = division?.toLowerCase() || '';
  
  if (divisionLower.includes('men') && divisionLower.includes('open')) {
    return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
  }
  if (divisionLower.includes('women') && divisionLower.includes('open')) {
    return { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' };
  }
  if (divisionLower.includes('mixed')) {
    return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
  }
  if (divisionLower.includes('senior')) {
    return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
  }
  
  // Default style
  return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
};
