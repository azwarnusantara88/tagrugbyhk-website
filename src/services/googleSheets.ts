const SHEET_ID = '1AertW5yTqPz0Sbzx2e2ODF74CikTY_hQS9KMbQSsWkuM';

const GID_FIXTURES = '0';
const GID_TEAMS = '1275974115';
const GID_PLAYERS = '652663105';
const GID_NEWS = '1320981095';
const GID_LADDERS = '397145122';
const GID_CONFIG = '446704132';

export interface Fixture {
  matchId: string;
  date: string;
  day: string;
  time: string;
  field: string;
  homeTeamId: string;
  homeTeam: string;
  awayTeamId: string;
  awayTeam: string;
  division: string;
  round: string;
  status: string;
  homeScore: number;
  awayScore: number;
  notes: string;
}

export interface Team {
  teamId: string;
  teamName: string;
  logoUrl: string;
  division: string;
  category: string;
  captain: string;
  coach: string;
  bio: string;
  active: boolean;
  status: string;
}

export interface Player {
  playerId: string;
  teamId: string;
  name: string;
  nickname: string;
  number: number;
  position: string;
  photoUrl: string;
  caps: number;
  fullName: string;
  preferredName: string;
  teamCode: string;
  teamName: string;
  division: string;
  jersey: string;
  nationality: string;
  bio: string;
  status: string;
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
  winPercent: number;
  form: string;
}

export interface Config {
  informationPackUrl: string;
  tournamentName: string;
  tournamentDates: string;
  venue: string;
}

const fallbackFixtures: Fixture[] = [
  { matchId: 'M001', date: '2026-04-11', day: 'Saturday', time: '12:30', field: 'Field 1', homeTeamId: 'HK_MXO1', homeTeam: "Hong Kong Mixed Open's 1", awayTeamId: 'JPN_MXO2', awayTeam: "Japan Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: 'Opening match' },
  { matchId: 'M002', date: '2026-04-11', day: 'Saturday', time: '12:30', field: 'Field 2', homeTeamId: 'JPN_MXO1', homeTeam: "Japan Mixed Open's 1", awayTeamId: 'HK_MXO2', awayTeam: "Hong Kong Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M003', date: '2026-04-11', day: 'Saturday', time: '13:07', field: 'Field 1', homeTeamId: 'JPN_SNR1', homeTeam: 'Japan Senior 1', awayTeamId: 'HK_SNR', awayTeam: "Hong Kong Senior Men's", division: 'Senior Mens', round: 'Group B', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M004', date: '2026-04-11', day: 'Saturday', time: '13:07', field: 'Field 2', homeTeamId: 'HK_MO2', homeTeam: "Hong Kong Men's Opens 2", awayTeamId: 'JPN_MO_WEST', awayTeam: "Japan Men's West", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M005', date: '2026-04-11', day: 'Saturday', time: '13:54', field: 'Field 1', homeTeamId: 'JPN_WO', homeTeam: 'Japan Women', awayTeamId: 'ASIA_WO', awayTeam: 'Australasia Women', division: 'Womens Open', round: 'Group D', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M006', date: '2026-04-11', day: 'Saturday', time: '14:31', field: 'Field 1', homeTeamId: 'JPN_SNR2', homeTeam: 'Japan Senior 2', awayTeamId: 'JPN_SNR3', awayTeam: 'Japan Senior 3', division: 'Senior Mens', round: 'Group B', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M007', date: '2026-04-11', day: 'Saturday', time: '14:31', field: 'Field 2', homeTeamId: 'HK_MO1', homeTeam: "Hong Kong Men's Opens 1", awayTeamId: 'JPN_MO_EAST', awayTeam: "Japan Men's East", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M008', date: '2026-04-11', day: 'Saturday', time: '15:18', field: 'Field 1', homeTeamId: 'JPN_MO_WEST', homeTeam: "Japan Men's West", awayTeamId: 'ASIA_MO', awayTeam: "Australasia Men's Open", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M009', date: '2026-04-11', day: 'Saturday', time: '15:50', field: 'Field 1', homeTeamId: 'HK_MXO1', homeTeam: "Hong Kong Mixed Open's 1", awayTeamId: 'JPN_MXO2', awayTeam: "Japan Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M010', date: '2026-04-11', day: 'Saturday', time: '15:50', field: 'Field 2', homeTeamId: 'JPN_MXO1', homeTeam: "Japan Mixed Open's 1", awayTeamId: 'HK_MXO2', awayTeam: "Hong Kong Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M011', date: '2026-04-12', day: 'Sunday', time: '08:00', field: 'Field 1', homeTeamId: 'ASIA_MXO', homeTeam: "Australasia Mixed's Open", awayTeamId: 'HK_MXO2', awayTeam: "Hong Kong Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M012', date: '2026-04-12', day: 'Sunday', time: '08:00', field: 'Field 2', homeTeamId: 'JPN_MO_EAST', homeTeam: "Japan Men's East", awayTeamId: 'HK_MO1', awayTeam: "Hong Kong Men's Opens 1", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M013', date: '2026-04-12', day: 'Sunday', time: '08:37', field: 'Field 1', homeTeamId: 'JPN_SNR1', homeTeam: 'Japan Senior 1', awayTeamId: 'JPN_SNR2', awayTeam: 'Japan Senior 2', division: 'Senior Mens', round: 'Group B', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M014', date: '2026-04-12', day: 'Sunday', time: '08:37', field: 'Field 2', homeTeamId: 'JPN_SNR3', homeTeam: 'Japan Senior 3', awayTeamId: 'HK_SNR', awayTeam: "Hong Kong Senior Men's", division: 'Senior Mens', round: 'Group B', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M015', date: '2026-04-12', day: 'Sunday', time: '09:24', field: 'Field 1', homeTeamId: 'HK_MO1', homeTeam: "Hong Kong Men's Opens 1", awayTeamId: 'ASIA_MO', awayTeam: "Australasia Men's Open", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M016', date: '2026-04-12', day: 'Sunday', time: '09:24', field: 'Field 2', homeTeamId: 'JPN_MO_EAST', homeTeam: "Japan Men's East", awayTeamId: 'HK_MO2', awayTeam: "Hong Kong Men's Opens 2", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M017', date: '2026-04-12', day: 'Sunday', time: '10:01', field: 'Field 2', homeTeamId: 'ASIA_WO', homeTeam: 'Australasia Women', awayTeamId: 'JPN_WO', awayTeam: 'Japan Women', division: 'Womens Open', round: 'Group D', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M018', date: '2026-04-12', day: 'Sunday', time: '10:38', field: 'Field 1', homeTeamId: 'JPN_MO_EAST', homeTeam: "Japan Men's East", awayTeamId: 'JPN_MO_WEST', awayTeam: "Japan Men's West", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: 'Featured match' },
  { matchId: 'M019', date: '2026-04-12', day: 'Sunday', time: '10:38', field: 'Field 2', homeTeamId: 'HK_MXO1', homeTeam: "Hong Kong Mixed Open's 1", awayTeamId: 'HK_MXO2', awayTeam: "Hong Kong Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: 'Featured match' },
  { matchId: 'M020', date: '2026-04-12', day: 'Sunday', time: '11:40', field: 'Field 1', homeTeamId: 'HK_MO1', homeTeam: "Hong Kong Men's Opens 1", awayTeamId: 'HK_MXO2', awayTeam: "Hong Kong Mixed Open's 2", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M021', date: '2026-04-12', day: 'Sunday', time: '11:40', field: 'Field 2', homeTeamId: 'JPN_MO_EAST', homeTeam: "Japan Men's East", awayTeamId: 'ASIA_MO', awayTeam: "Australasia Men's Open", division: 'Mens Open', round: 'Group C', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M022', date: '2026-04-12', day: 'Sunday', time: '12:17', field: 'Field 1', homeTeamId: 'HK_SNR', homeTeam: "Hong Kong Senior Men's", awayTeamId: 'JPN_SNR2', awayTeam: 'Japan Senior 2', division: 'Senior Mens', round: 'Group B', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M023', date: '2026-04-12', day: 'Sunday', time: '12:17', field: 'Field 2', homeTeamId: 'JPN_MXO1', homeTeam: "Japan Mixed Open's 1", awayTeamId: 'JPN_MXO2', awayTeam: "Japan Mixed Open's 2", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M024', date: '2026-04-12', day: 'Sunday', time: '13:04', field: 'Field 1', homeTeamId: 'ASIA_MXO', homeTeam: "Australasia Mixed's Open", awayTeamId: 'HK_MXO1', awayTeam: "Hong Kong Mixed Open's 1", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M025', date: '2026-04-12', day: 'Sunday', time: '14:18', field: 'Field 1', homeTeamId: 'JPN_SNR1', homeTeam: 'Japan Senior 1', awayTeamId: 'JPN_SNR2', awayTeam: 'Japan Senior 2', division: 'Senior Mens', round: 'Group B', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M026', date: '2026-04-12', day: 'Sunday', time: '14:18', field: 'Field 2', homeTeamId: 'JPN_MXO1', homeTeam: "Japan Mixed Open's 1", awayTeamId: 'ASIA_MO', awayTeam: "Australasia Men's Open", division: 'Mixed Open', round: 'Group A', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: '' },
  { matchId: 'M027', date: '2026-04-12', day: 'Sunday', time: '15:30', field: 'Field 1', homeTeamId: 'ASIA_WO', homeTeam: 'Australasia Women', awayTeamId: 'JPN_WO', awayTeam: 'Japan Women', division: 'Womens Open', round: 'Final', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: 'Womens Final' },
  { matchId: 'M028', date: '2026-04-12', day: 'Sunday', time: '15:30', field: 'Field 2', homeTeamId: 'TBD', homeTeam: 'TBD', awayTeamId: 'TBD', awayTeam: 'TBD', division: 'TBD', round: 'Final', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: 'Mens Final' },
  { matchId: 'M029', date: '2026-04-12', day: 'Sunday', time: '16:15', field: 'Field 1', homeTeamId: 'TBD', homeTeam: 'TBD', awayTeamId: 'TBD', awayTeam: 'TBD', division: 'TBD', round: 'Final', status: 'Scheduled', homeScore: 0, awayScore: 0, notes: 'Grand Final' },
];

const fallbackTeams: Team[] = [
  { teamId: 'HK_MXO1', teamName: "Hong Kong Mixed Open's 1", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'HK_MXO2', teamName: "Hong Kong Mixed Open's 2", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'HK_MO1', teamName: "Hong Kong Men's Opens 1", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'HK_MO2', teamName: "Hong Kong Men's Opens 2", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'HK_SNR', teamName: "Hong Kong Senior Men's", logoUrl: '', division: 'Senior Mens', category: '35+', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MXO1', teamName: "Japan Mixed Open's 1", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MXO2', teamName: "Japan Mixed Open's 2", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MO_EAST', teamName: "Japan Men's East", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MO_WEST', teamName: "Japan Men's West", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_SNR1', teamName: 'Japan Senior 1', logoUrl: '', division: 'Senior Mens', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_SNR2', teamName: 'Japan Senior 2', logoUrl: '', division: 'Senior Mens', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_SNR3', teamName: 'Japan Senior 3', logoUrl: '', division: 'Senior Mens', category: '40+', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_WO', teamName: 'Japan Women', logoUrl: '', division: 'Womens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'ASIA_MXO', teamName: "Australasia Mixed's Open", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'ASIA_MO', teamName: "Australasia Men's Open", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'ASIA_WO', teamName: 'Australasia Women', logoUrl: '', division: 'Womens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
];

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

const fetchSheetFromBrowser = async (gid: string): Promise<string[][]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const csvText = await response.text();
  return parseCSV(csvText);
};

export const fetchFixtures = async (): Promise<Fixture[]> => {
  try {
    const rows = await fetchSheetFromBrowser(GID_FIXTURES);
    
    console.log('Fetched fixtures from Google Sheets:', rows.length, 'rows');
    
    const fixtures: Fixture[] = [];
    let dataStarted = false;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const matchId = row[0]?.trim();
      
      if (!dataStarted) {
        if (matchId && matchId === 'M001') {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (!matchId || !matchId.startsWith('M')) continue;
      
      fixtures.push({
        matchId: matchId,
        date: row[1] || '',
        day: row[2] || '',
        time: row[3] || '',
        field: row[4] || '',
        homeTeamId: row[5] || '',
        homeTeam: row[6] || '',
        awayTeamId: row[8] || '',
        awayTeam: row[9] || '',
        division: row[11] || '',
        round: row[12] || '',
        status: row[13] || '',
        homeScore: parseInt(row[7]) || 0,
        awayScore: parseInt(row[10]) || 0,
        notes: row[14] || '',
      });
    }
    
    if (fixtures.length > 0) {
      console.log('Successfully loaded', fixtures.length, 'fixtures from Google Sheets');
      return fixtures;
    }
    
    throw new Error('No fixtures parsed from sheet');
    
  } catch (err) {
    console.warn('Failed to fetch from Google Sheets, using fallback:', err);
    return fallbackFixtures;
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const rows = await fetchSheetFromBrowser(GID_TEAMS);
    
    console.log('Fetched teams from Google Sheets:', rows.length, 'rows');
    
    const teams: Team[] = [];
    let dataStarted = false;
    
    for (const row of rows) {
      const teamId = row[0]?.trim();
      
      if (!dataStarted) {
        if (teamId && (teamId.startsWith('HK') || teamId.startsWith('JPN') || teamId.startsWith('ASIA'))) {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (!teamId) continue;
      
      const status = row[12]?.trim() || 'Active';
      
      teams.push({
        teamId: teamId,
        teamName: row[1] || '',
        logoUrl: row[2] || '',
        division: row[4] || '',
        category: row[5] || '',
        captain: row[6] || '',
        coach: row[8] || '',
        bio: row[10] || '',
        active: row[11] === 'TRUE',
        status: status,
      });
    }
    
    if (teams.length > 0) {
      console.log('Successfully loaded', teams.length, 'teams from Google Sheets');
      return teams;
    }
    
    throw new Error('No teams parsed from sheet');
    
  } catch (err) {
    console.warn('Failed to fetch teams from Google Sheets, using fallback:', err);
    return fallbackTeams;
  }
};

export const fetchTeamById = async (teamId: string): Promise<Team | null> => {
  const teams = await fetchTeams();
  return teams.find(t => t.teamId === teamId) || null;
};

export const fetchPlayers = async (_teamId?: string): Promise<Player[]> => {
  try {
    const rows = await fetchSheetFromBrowser(GID_PLAYERS);
    
    const players: Player[] = [];
    let dataStarted = false;
    
    for (const row of rows) {
      const playerId = row[0]?.trim();
      
      if (!dataStarted) {
        if (playerId && playerId.startsWith('P')) {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (!playerId) continue;
      
      players.push({
        playerId: playerId,
        teamId: row[1] || '',
        name: row[2] || '',
        nickname: row[3] || '',
        number: parseInt(row[4]) || 0,
        position: row[5] || '',
        photoUrl: row[6] || '',
        caps: parseInt(row[7]) || 0,
        fullName: row[2] || '',
        preferredName: row[3] || row[2] || '',
        teamCode: row[1] || '',
        teamName: '',
        division: '',
        jersey: row[4] || '',
        nationality: row[11] || '',
        bio: row[12] || '',
        status: row[13] || 'Active',
      });
    }
    
    return players;
    
  } catch (err) {
    console.warn('Failed to fetch players:', err);
    return [];
  }
};

export const fetchNews = async (): Promise<NewsArticle[]> => {
  try {
    const rows = await fetchSheetFromBrowser(GID_NEWS);
    
    const articles: NewsArticle[] = [];
    let dataStarted = false;
    
    for (const row of rows) {
      const articleId = row[0]?.trim();
      
      if (!dataStarted) {
        if (articleId && articleId.startsWith('N')) {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (!articleId) continue;
      if (row[9] !== 'TRUE') continue;
      
      articles.push({
        articleId: articleId,
        title: row[1] || '',
        author: row[2] || '',
        date: row[3] || '',
        category: row[4] || '',
        excerpt: row[5] || '',
        content: row[6] || '',
        featuredImage: row[7] || '',
        galleryImages: row[8] ? row[8].split(',') : [],
        published: true,
        slug: row[10] || '',
      });
    }
    
    return articles;
    
  } catch (err) {
    console.warn('Failed to fetch news:', err);
    return [];
  }
};

export const fetchNewsBySlug = async (slug: string): Promise<NewsArticle | null> => {
  const articles = await fetchNews();
  return articles.find(a => a.slug === slug) || null;
};

export const fetchStandings = async (_division?: string): Promise<Standing[]> => {
  try {
    const rows = await fetchSheetFromBrowser(GID_LADDERS);
    
    const standings: Standing[] = [];
    let dataStarted = false;
    
    for (const row of rows) {
      const position = parseInt(row[0]);
      
      if (!dataStarted) {
        if (!isNaN(position) && position > 0) {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (isNaN(position)) continue;
      
      standings.push({
        position: position,
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
      });
    }
    
    return standings;
    
  } catch (err) {
    console.warn('Failed to fetch standings:', err);
    return [];
  }
};

export const fetchConfig = async (): Promise<Config> => {
  try {
    const rows = await fetchSheetFromBrowser(GID_CONFIG);
    
    const config: Config = {
      informationPackUrl: '',
      tournamentName: 'Tag Asia Cup 2026',
      tournamentDates: 'April 11-12, 2026',
      venue: 'J-Green Sakai, Osaka',
    };
    
    for (const row of rows) {
      const key = row[0]?.trim();
      const value = row[1]?.trim();
      
      switch (key) {
        case 'TournamentName':
          config.tournamentName = value;
          break;
        case 'EventDate':
          config.tournamentDates = value;
          break;
        case 'Location':
          config.venue = value;
          break;
        case 'InformationPack':
          config.informationPackUrl = value;
          break;
      }
    }
    
    return config;
    
  } catch (err) {
    console.warn('Failed to fetch config, using defaults:', err);
    return {
      informationPackUrl: '',
      tournamentName: 'Tag Asia Cup 2026',
      tournamentDates: 'April 11-12, 2026',
      venue: 'J-Green Sakai, Osaka',
    };
  }
};

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

export const getAbbreviatedDivision = (division: string): string => {
  const d = division?.toLowerCase() || '';
  if (d.includes('senior') && d.includes('men')) return 'SENIOR MENS';
  if (d.includes('mens')) return 'MENS';
  if (d.includes('mixed')) return 'MIXED';
  if (d.includes('women')) return 'WOMENS';
  return division?.toUpperCase() || 'TBD';
};

export const getDivisionCode = (division: string): string => {
  const d = division?.toLowerCase() || '';
  if (d.includes('senior') && d.includes('men')) return 'SNR';
  if (d.includes('mens')) return 'MO';
  if (d.includes('mixed')) return 'MXO';
  if (d.includes('women')) return 'WO';
  return 'TBD';
};
