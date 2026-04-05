// Google Sheets Service - Client-side fetching for live data
// Updated for: Tag Asia Cup 2026
// Your Sheet ID: 1XgS6H0S5wwhP8YfjKoazjQF_M4gs-4-5TWrp2-OD8lA

const SHEET_ID = '1XgS6H0S5wwhP8YfjKoazjQF_M4gs-4-5TWrp2-OD8lA';

// Your GID values from your Google Sheet tabs:
const SHEET_GIDS = {
  FIXTURES: '114025676',
  TEAMS: '1056269168',
  PLAYERS: '924424186',
  NEWS: '1489783783',
  LADDERS: '1566050881',
};

// ============================================
// INTERFACES
// ============================================

export interface Fixture {
  matchId: string;
  date: string;
  time: string;
  field: string;
  division: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINAL';
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

// ============================================
// CSV FETCH FUNCTION
// ============================================
async function fetchSheetData(gid: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

// ============================================
// CSV PARSER
// ============================================
function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

// ============================================
// FETCH FIXTURES
// ============================================
export async function fetchFixtures(): Promise<Fixture[]> {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    matchId: row[0] || '',
    date: row[1] || '',
    time: row[2] || '',
    field: row[3] || '',
    division: row[4] || '',
    homeTeam: row[5] || '',
    awayTeam: row[6] || '',
    homeScore: parseInt(row[7]) || 0,
    awayScore: parseInt(row[8]) || 0,
    status: (row[9] as 'SCHEDULED' | 'LIVE' | 'FINAL') || 'SCHEDULED',
  }));
}

// ============================================
// FETCH TEAMS
// ============================================
export async function fetchTeams(): Promise<Team[]> {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    teamId: row[0] || '',
    teamName: row[1] || '',
    division: row[2] || '',
    region: row[3] || '',
    captain: row[4] || '',
    logoUrl: row[5] || '',
    wins: parseInt(row[6]) || 0,
    losses: parseInt(row[7]) || 0,
    points: parseInt(row[8]) || 0,
  }));
}

// ============================================
// FETCH PLAYERS
// ============================================
export async function fetchPlayers(): Promise<Player[]> {
  const data = await fetchSheetData(SHEET_GIDS.PLAYERS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    playerId: row[0] || '',
    teamId: row[1] || '',
    fullName: row[2] || '',
    teamName: row[3] || '',
    country: row[4] || '',
    number: parseInt(row[5]) || 0,
    position: row[6] || '',
    photoUrl: row[7] || '',
    playersToWatch: row[8]?.toLowerCase() === 'true' || row[8] === 'TRUE' || row[8] === '1' || row[8]?.toLowerCase() === 'yes',
  }));
}

// ============================================
// FETCH PLAYERS TO WATCH (filtered)
// ============================================
export async function fetchPlayersToWatch(): Promise<Player[]> {
  const allPlayers = await fetchPlayers();
  return allPlayers.filter(player => player.playersToWatch);
}

// ============================================
// FETCH NEWS
// ============================================
export async function fetchNews(): Promise<NewsItem[]> {
  const data = await fetchSheetData(SHEET_GIDS.NEWS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
    slug: row[0] || '',
    title: row[1] || '',
    date: row[2] || '',
    excerpt: row[3] || '',
    imageUrl: row[4] || '',
    content: row[5] || '',
    author: row[6] || '',
  }));
}

// ============================================
// FETCH STANDINGS/LADDERS
// ============================================
export async function fetchStandings(): Promise<Standing[]> {
  const data = await fetchSheetData(SHEET_GIDS.LADDERS);
  if (data.length < 2) return [];
  
  const rows = data.slice(1);
  
  return rows.map(row => ({
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

export async function fetchPlayersToWatchByTeam(teamId: string): Promise<Player[]> {
  const players = await fetchPlayersToWatch();
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

// ============================================
// HOW TO SET UP YOUR GOOGLE SHEET
// ============================================
//
// 1. Make your sheet public:
//    - Click Share → Change to anyone with the link → Viewer
//
// 2. Sheet structure for each tab:
//
//    FIXTURES tab (gid=114025676):
//    A: MatchID | B: Date | C: Time | D: Field | E: Division | F: HomeTeam | G: AwayTeam | H: HomeScore | I: AwayScore | J: Status
//
//    TEAMS tab (gid=1056269168):
//    A: TeamID | B: TeamName | C: Division | D: Region | E: Captain | F: LogoUrl | G: Wins | H: Losses | I: Points
//
//    PLAYERS tab (gid=924424186):
//    A: PlayerID | B: TeamID | C: FullName | D: TeamName | E: Country | F: Number | G: Position | H: PhotoURL | I: PlayersToWatch (TRUE/FALSE)
//
//    NEWS tab (gid=1489783783):
//    A: Slug | B: Title | C: Date | D: Excerpt | E: ImageUrl | F: Content | G: Author
//
//    LADDERS tab (gid=1566050881):
//    A: TeamID | B: TeamName | C: Division | D: Played | E: Won | F: Lost | G: PointsFor | H: PointsAgainst | I: PointsDiff | J: TotalPoints | K: Position
//
// Your Sheet: https://docs.google.com/spreadsheets/d/1XgS6H0S5wwhP8YfjKoazjQF_M4gs-4-5TWrp2-OD8lA/edit
