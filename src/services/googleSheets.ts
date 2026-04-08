// Google Sheets Service - Matches Tag Asia Cup 2026 Sheet Structure
// Sheet ID: 1SagsLUTo1UvvgsrGuZqd_YftctlKN5NMi9_1K-tBsHs

const SHEET_ID = '1SagsLUTo1UvvgsrGuZqd_YftctlKN5NMi9_1K-tBsHs';

// Sheet GIDs
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

// ============================================
// CONFIG Interface (Key-Value pairs)
// ============================================
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

// ============================================
// TEAMS Interface
// Columns: TeamID,TeamName,Division,Region,Captain,Coach,LogoURL,LOGO,ShortCode,Category,Contact,Active,Status,Founded,Website
// ============================================
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

// ============================================
// FIXTURES Interface
// Columns: MatchID,Date,Day,Time,Field,HomeTeamID,HomeTeam,HomeScore,AwayTeamID,AwayTeam,AwayScore,Division,Round,Status,Notes
// ============================================
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

// ============================================
// PLAYERS Interface
// Columns: PlayerID,TeamID,FullName,TeamName,Region,Number,Position,PhotoURL,PlayersToWatch,Tries,Weight,Nationality,Bio,Status,Debut
// ============================================
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

// ============================================
// NEWS Interface
// Columns: ArticleID,Title,Author,Date,Category,Excerpt,Content,FeaturedImage,GalleryImages,Published,Slug,Tags,Views
// ============================================
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

// Alias for compatibility
export type NewsItem = NewsArticle;

// ============================================
// LADDER Interface
// Columns: Position,TeamID,TeamName,Division,Played,Won,Drawn,Lost,PointsFor,PointsAgainst,PointsDiff,BonusPoints,TotalPoints,WinPercent,Form
// ============================================
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

// ============================================
// DIVISION STYLES
// ============================================
export interface DivisionStyle {
  bgClass: string;
  textClass: string;
  color: string;
}

export const divisionColors: Record<string, DivisionStyle> = {
  'Mixed Open': { bgClass: 'bg-[#CFFF2E]', textClass: 'text-[#0B3D2E]', color: '#CFFF2E' },
  'Mens Open': { bgClass: 'bg-[#0B3D2E]', textClass: 'text-white', color: '#0B3D2E' },
  'Womens Open': { bgClass: 'bg-[#FF6B6B]', textClass: 'text-white', color: '#FF6B6B' },
  'Senior Mens': { bgClass: 'bg-[#4ECDC4]', textClass: 'text-white', color: '#4ECDC4' },
  'TBD': { bgClass: 'bg-gray-500', textClass: 'text-white', color: '#999999' },
};

export const getDivisionStyle = (divisionName: string): DivisionStyle => {
  const normalized = divisionName?.trim() || 'TBD';
  return divisionColors[normalized] || divisionColors['TBD'];
};

// ============================================
// CSV PARSER
// ============================================
const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = [];
  const lines = csvText.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

    const cells: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    cells.push(cell.trim());
    rows.push(cells);
  }

  return rows;
};

// ============================================
// SHEET FETCHER
// ============================================
const fetchSheetFromBrowser = async (gid: string): Promise<string[][]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const csvText = await response.text();
  return parseCSV(csvText);
};

// ============================================
// FETCH CONFIG
// Columns: Key,Value
// ============================================
export const fetchConfig = async (): Promise<Config> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.CONFIG);

    const config: Config = {
      tournamentName: 'Tag Asia Cup 2026',
      eventDate: 'April 11-12, 2026',
      location: 'J-Green Sakai, Osaka',
      websiteUrl: 'https://tagrugbyhk.org',
      informationPack: '',
      registrationOpen: true,
      registrationDeadline: '',
      contactEmail: '',
      contactPhone: '',
      socialInstagram: '',
      socialFacebook: '',
      socialYouTube: '',
      socialTwitter: '',
    };

    // Skip header row, parse key-value pairs
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 2) continue;

      const key = row[0]?.trim();
      const value = row[1]?.trim();

      if (!key || !value) continue;

      switch (key) {
        case 'TournamentName':
          config.tournamentName = value;
          break;
        case 'EventDate':
          config.eventDate = value;
          break;
        case 'Location':
          config.location = value;
          break;
        case 'WebsiteURL':
          config.websiteUrl = value;
          break;
        case 'InformationPack':
          config.informationPack = value;
          break;
        case 'RegistrationOpen':
          config.registrationOpen = value.toUpperCase() === 'TRUE';
          break;
        case 'RegistrationDeadline':
          config.registrationDeadline = value;
          break;
        case 'ContactEmail':
          config.contactEmail = value;
          break;
        case 'ContactPhone':
          config.contactPhone = value;
          break;
        case 'SocialInstagram':
          config.socialInstagram = value;
          break;
        case 'SocialFacebook':
          config.socialFacebook = value;
          break;
        case 'SocialYouTube':
          config.socialYouTube = value;
          break;
        case 'SocialTwitter':
          config.socialTwitter = value;
          break;
      }
    }

    return config;
  } catch (err) {
    console.warn('Failed to fetch config, using defaults:', err);
    return {
      tournamentName: 'Tag Asia Cup 2026',
      eventDate: 'April 11-12, 2026',
      location: 'J-Green Sakai, Osaka',
      websiteUrl: 'https://tagrugbyhk.org',
      informationPack: '',
      registrationOpen: true,
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

// ============================================
// FETCH TEAMS
// Columns: TeamID,TeamName,Division,Region,Captain,Coach,LogoURL,LOGO,ShortCode,Category,Contact,Active,Status,Founded,Website
// ============================================
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.TEAMS);
    console.log('Fetched teams from Google Sheets:', rows.length, 'rows');

    const teams: Team[] = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 3) continue;

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

// ============================================
// FETCH FIXTURES
// Columns: MatchID,Date,Day,Time,Field,HomeTeamID,HomeTeam,HomeScore,AwayTeamID,AwayTeam,AwayScore,Division,Round,Status,Notes
// ============================================
export const fetchFixtures = async (): Promise<Fixture[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.FIXTURES);
    console.log('Fetched fixtures from Google Sheets:', rows.length, 'rows');

    const fixtures: Fixture[] = [];

    // Skip header row
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

// ============================================
// FETCH PLAYERS
// Columns: PlayerID,TeamID,FullName,TeamName,Region,Number,Position,PhotoURL,PlayersToWatch,Tries,Weight,Nationality,Bio,Status,Debut
// ============================================
export const fetchPlayers = async (teamId?: string): Promise<Player[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.PLAYERS);
    console.log('Fetched players from Google Sheets:', rows.length, 'rows');

    const players: Player[] = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 3) continue;

      const playerId = row[0]?.trim();
      if (!playerId) continue;

      const playerTeamId = row[1]?.trim();

      // Filter by teamId if provided
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

// ============================================
// FETCH NEWS
// Columns: ArticleID,Title,Author,Date,Category,Excerpt,Content,FeaturedImage,GalleryImages,Published,Slug,Tags,Views
// ============================================
export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.NEWS);
    console.log('Fetched news from Google Sheets:', rows.length, 'rows');

    const articles: NewsArticle[] = [];

    // Skip header row
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

    // Filter to only published articles
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

// ============================================
// FETCH STANDINGS/LADDER
// Columns: Position,TeamID,TeamName,Division,Played,Won,Drawn,Lost,PointsFor,PointsAgainst,PointsDiff,BonusPoints,TotalPoints,WinPercent,Form
// ============================================
export const fetchStandings = async (division?: string): Promise<Standing[]> => {
  try {
    const rows = await fetchSheetFromBrowser(SHEET_GIDS.LADDER);
    console.log('Fetched standings from Google Sheets:', rows.length, 'rows');

    const standings: Standing[] = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 5) continue;

      const teamId = row[1]?.trim();
      if (!teamId) continue;

      const standingDivision = row[3] || '';

      // Filter by division if provided
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

// Alias for compatibility
export const getLadder = fetchStandings;
export const fetchLadder = fetchStandings;

// ============================================
// ALIAS EXPORTS (for backward compatibility)
// ============================================
export { fetchFixtures as getFixtures };
export { fetchTeams as getTeams };
export { fetchNews as getNews };
export { fetchConfig as getConfig };
