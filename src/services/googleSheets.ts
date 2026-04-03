// Google Sheets Service - Client-side fetching for live data
// New Sheet ID: 1XgS6H0S5wwhP8YfjKoazjQF_M4gs-4-5TWrp2-OD8lA

const SHEET_ID = '1XgS6H0S5wwhP8YfjKoazjQF_M4gs-4-5TWrp2-OD8lA';

// ============================================
// FIXTURES Interface
// ============================================
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

// ============================================
// TEAMS Interface
// ============================================
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

// ============================================
// PLAYERS Interface
// ============================================
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

// ============================================
// NEWS Interface
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
}

// ============================================
// STANDINGS Interface
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
  winPercent: number;
  form: string;
}

// ============================================
// CONFIG Interface
// ============================================
export interface Config {
  informationPackUrl: string;
  tournamentName: string;
  tournamentDates: string;
  venue: string;
}

// ============================================
// FALLBACK DATA (used if Google Sheets fails)
// ============================================
const fallbackFixtures: Fixture[] = [
  // Saturday Matches
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
  // Sunday Matches
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
  { teamId: 'HK_SNR', teamName: "Hong Kong Senior Men's", logoUrl: '', division: 'Senior Mens', category: '30-60', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MXO1', teamName: "Japan Mixed Open's 1", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MXO2', teamName: "Japan Mixed Open's 2", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MO_EAST', teamName: "Japan Men's East", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_MO_WEST', teamName: "Japan Men's West", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_SNR1', teamName: 'Japan Senior 1', logoUrl: '', division: 'Senior Mens', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_SNR2', teamName: 'Japan Senior 2', logoUrl: '', division: 'Senior Mens', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_SNR3', teamName: 'Japan Senior 3', logoUrl: '', division: 'Senior Mens', category: '30-60', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'JPN_WO', teamName: 'Japan Women', logoUrl: '', division: 'Womens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'ASIA_MXO', teamName: "Australasia Mixed's Open", logoUrl: '', division: 'Mixed Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'ASIA_MO', teamName: "Australasia Men's Open", logoUrl: '', division: 'Mens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
  { teamId: 'ASIA_WO', teamName: 'Australasia Women', logoUrl: '', division: 'Womens Open', category: 'Open', captain: 'TBD', coach: 'TBD', bio: '', active: true, status: 'Active' },
];

// ============================================
// CLIENT-SIDE Google Sheets Fetch
// This runs in the browser and CAN access Google Sheets
// ============================================

// Parse CSV data from Google Sheets
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

// Fetch sheet data from browser (client-side)
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
// FETCH FIXTURES (with live score sync)
// ============================================
export const fetchFixtures = async (): Promise<Fixture[]> => {
  try {
    // Try to fetch from Google Sheets (client-side)
    // FIXTURES tab gid = 1885819712
    // RESULTS tab gid = 1885819712 (same sheet, different range)
    
    const [fixtureRows, resultRows] = await Promise.all([
      fetchSheetFromBrowser('1885819712'),
      fetchSheetFromBrowser('1885819712') // Same sheet for now
    ]);
    
    console.log('Fetched fixtures from Google Sheets:', fixtureRows.length, 'rows');
    
    // Parse RESULTS for scores
    const scores = new Map<string, { homeScore: number; awayScore: number }>();
    
    // Find RESULTS data (usually in a different section or tab)
    // For now, we'll check if there's a RESULTS section in the same sheet
    let inResultsSection = false;
    
    for (const row of resultRows) {
      const matchId = row[0]?.trim();
      
      // Check if this is the RESULTS header
      if (matchId === 'MatchID' && row[1]?.includes('HomeTeam')) {
        inResultsSection = true;
        continue;
      }
      
      if (inResultsSection && matchId && matchId.startsWith('M')) {
        const homeScore = row[2] ? Number(row[2]) : 0;
        const awayScore = row[5] ? Number(row[5]) : 0;
        scores.set(matchId, {
          homeScore: isNaN(homeScore) ? 0 : homeScore,
          awayScore: isNaN(awayScore) ? 0 : awayScore
        });
      }
    }
    
    // Parse FIXTURES
    const fixtures: Fixture[] = [];
    let dataStarted = false;
    
    for (let i = 0; i < fixtureRows.length; i++) {
      const row = fixtureRows[i];
      const matchId = row[0]?.trim();
      
      // Skip headers until we find M001
      if (!dataStarted) {
        if (matchId && matchId === 'M001') {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (!matchId || !matchId.startsWith('M')) continue;
      
      const scoreData = scores.get(matchId) || { homeScore: 0, awayScore: 0 };
      
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
        homeScore: scoreData.homeScore,
        awayScore: scoreData.awayScore,
        notes: row[15] || '',
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

// ============================================
// FETCH TEAMS
// ============================================
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    // TEAMS tab gid = 114025676
    const rows = await fetchSheetFromBrowser('114025676');
    
    console.log('Fetched teams from Google Sheets:', rows.length, 'rows');
    
    const teams: Team[] = [];
    let dataStarted = false;
    
    for (const row of rows) {
      const teamId = row[0]?.trim();
      
      // Skip until we find first TeamID
      if (!dataStarted) {
        if (teamId && (teamId.startsWith('HK') || teamId.startsWith('JPN') || teamId.startsWith('ASIA'))) {
          dataStarted = true;
        } else {
          continue;
        }
      }
      
      if (!teamId) continue;
      
      const status = row[16]?.trim() || 'Active';
      
      teams.push({
        teamId: teamId,
        teamName: row[1] || '',
        logoUrl: row[2] || '',
        division: row[4] || '',
        category: row[5] || '',
        captain: row[6] || '',
        coach: row[8] || '',
        bio: '',
        active: status === 'Active',
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

// ============================================
// FETCH PLAYERS
// ============================================
export const fetchPlayers = async (_teamId?: string): Promise<Player[]> => {
  // Placeholder - implement when needed
  return [];
};

// ============================================
// FETCH NEWS
// ============================================
export const fetchNews = async (): Promise<NewsArticle[]> => {
  // Placeholder - implement when needed
  return [];
};

export const fetchNewsBySlug = async (slug: string): Promise<NewsArticle | null> => {
  const articles = await fetchNews();
  return articles.find(a => a.slug === slug) || null;
};

// ============================================
// FETCH STANDINGS
// ============================================
export const fetchStandings = async (_division?: string): Promise<Standing[]> => {
  // Placeholder - implement when needed
  return [];
};

// ============================================
// FETCH CONFIG
// ============================================
export const fetchConfig = async (): Promise<Config> => {
  try {
    // Try to fetch from SETTINGS tab (gid 0 is usually the first sheet)
    const rows = await fetchSheetFromBrowser('0');
    
    const config: Config = {
      informationPackUrl: '',
      tournamentName: 'Tag Asia Cup 2026',
      tournamentDates: 'April 11-12, 2026',
      venue: 'J-Green Sakai, Osaka',
    };
    
    // Parse SETTINGS data if available
    let inSettingsSection = false;
    for (const row of rows) {
      const key = row[0]?.trim();
      const value = row[1]?.trim();
      
      if (key === 'Key' && value === 'Value') {
        inSettingsSection = true;
        continue;
      }
      
      if (inSettingsSection && key && value) {
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
          case 'WebsiteURL':
            config.informationPackUrl = value;
            break;
        }
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

// ============================================
// DIVISION COLORS
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

// Helper functions
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
