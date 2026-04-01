// Google Sheets Service - Centralized data fetching
const SHEET_ID = '1T3Zmy8oXY8FtkJsz6XApqr_PhVNSgC1yFAT2N_BkYDU';

// Generic fetch function for any sheet tab
export const fetchSheetData = async (sheetName: string): Promise<any[]> => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    if (!jsonMatch) {
      throw new Error('Could not parse Google Sheets response');
    }
    
    const data = JSON.parse(jsonMatch[1]);
    
    const rows: any[] = [];
    if (data.table && data.table.rows) {
      data.table.rows.forEach((row: any) => {
        const rowData: any[] = [];
        if (row.c) {
          row.c.forEach((cell: any) => {
            rowData.push(cell ? (cell.v !== null ? cell.v : '') : '');
          });
        }
        rows.push(rowData);
      });
    }
    
    return rows;
  } catch (err) {
    console.error(`Failed to fetch ${sheetName}:`, err);
    return [];
  }
};

// ============================================
// FIXTURES
// ============================================
export interface Fixture {
  matchId: string;
  date: string;
  day: string;
  time: string;
  field: string;
  homeTeam: string;
  awayTeam: string;
  division: string;
  round: string;
  status: string;
  homeScore: number;
  awayScore: number;
  notes: string;
}

export const fetchFixtures = async (): Promise<Fixture[]> => {
  const rows = await fetchSheetData('FIXTURES');
  return rows.slice(1)
    .filter(row => row[0])
    .map(row => ({
      matchId: row[0] || '',
      date: row[1] || '',
      day: row[2] || '',
      time: row[3] || '',
      field: row[4] || '',
      homeTeam: row[6] || '',
      awayTeam: row[9] || '',
      division: row[11] || '',
      round: row[12] || '',
      status: row[13] || '',
      homeScore: row[14] || '',
      awayScore: row[15] || '',
      notes: row[16] || '',
    }));
};

// ============================================
// TEAMS
// ============================================
export interface Team {
  teamId: string;
  teamName: string;
  division: string;
  coach: string;
  captain: string;
  logoUrl: string;
  bio: string;
  active: boolean;
}

export const fetchTeams = async (): Promise<Team[]> => {
  const rows = await fetchSheetData('TEAMS');
  return rows.slice(1)
    .filter(row => row[0] && row[7] === 'TRUE')
    .map(row => ({
      teamId: row[0] || '',
      teamName: row[1] || '',
      division: row[2] || '',
      coach: row[3] || '',
      captain: row[4] || '',
      logoUrl: row[5] || '',
      bio: row[6] || '',
      active: row[7] === 'TRUE',
    }));
};

export const fetchTeamById = async (teamId: string): Promise<Team | null> => {
  const teams = await fetchTeams();
  return teams.find(t => t.teamId === teamId) || null;
};

// ============================================
// PLAYERS
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
}

export const fetchPlayers = async (teamId?: string): Promise<Player[]> => {
  const rows = await fetchSheetData('PLAYERS');
  let players = rows.slice(1)
    .filter(row => row[0])
    .map(row => ({
      playerId: row[0] || '',
      teamId: row[1] || '',
      name: row[2] || '',
      nickname: row[3] || '',
      number: row[4] || 0,
      position: row[5] || '',
      photoUrl: row[6] || '',
      caps: row[7] || 0,
    }));
  
  if (teamId) {
    players = players.filter(p => p.teamId === teamId);
  }
  
  return players;
};

// ============================================
// NEWS
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

export const fetchNews = async (): Promise<NewsArticle[]> => {
  const rows = await fetchSheetData('NEWS');
  return rows.slice(1)
    .filter(row => row[0] && row[10] === 'TRUE') // Only published
    .map(row => ({
      articleId: row[0] || '',
      title: row[1] || '',
      author: row[2] || 'HKTR Media',
      date: row[3] || '',
      category: row[4] || 'General',
      excerpt: row[5] || '',
      content: row[6] || '',
      featuredImage: row[7] || '',
      galleryImages: row[8] ? row[8].split(',').map((url: string) => url.trim()) : [],
      published: row[10] === 'TRUE',
      slug: row[11] || '',
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const fetchNewsBySlug = async (slug: string): Promise<NewsArticle | null> => {
  const articles = await fetchNews();
  return articles.find(a => a.slug === slug) || null;
};

// ============================================
// STANDINGS / LADDER
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
}

export const fetchStandings = async (division?: string): Promise<Standing[]> => {
  const rows = await fetchSheetData('STANDINGS');
  let standings = rows.slice(1)
    .filter(row => row[0])
    .map(row => ({
      position: row[0] || 0,
      teamId: row[1] || '',
      teamName: row[2] || '',
      division: row[3] || '',
      played: row[4] || 0,
      won: row[5] || 0,
      drawn: row[6] || 0,
      lost: row[7] || 0,
      pointsFor: row[8] || 0,
      pointsAgainst: row[9] || 0,
      pointsDiff: row[10] || 0,
      bonusPoints: row[11] || 0,
      totalPoints: row[12] || 0,
    }));
  
  if (division) {
    standings = standings.filter(s => s.division === division);
  }
  
  return standings.sort((a, b) => a.position - b.position);
};

// ============================================
// CONFIG
// ============================================
export interface Config {
  informationPackUrl: string;
  tournamentName: string;
  tournamentDates: string;
  venue: string;
}

export const fetchConfig = async (): Promise<Config> => {
  const rows = await fetchSheetData('CONFIG');
  const config: any = {};
  
  rows.slice(1).forEach(row => {
    if (row[0] && row[1]) {
      config[row[0]] = row[1];
    }
  });
  
  return {
    informationPackUrl: config.information_pack_url || '',
    tournamentName: config.tournament_name || 'Tag Asia Cup 2026',
    tournamentDates: config.tournament_dates || 'April 11-12, 2026',
    venue: config.venue || 'J-Green Sakai, Osaka',
  };
};

// ============================================
// DIVISIONS (for color codes)
// ============================================
export interface Division {
  divisionId: string;
  divisionName: string;
  color: string;
  bgClass: string;
  textClass: string;
}

export const fetchDivisions = async (): Promise<Division[]> => {
  const rows = await fetchSheetData('DIVISIONS');
  return rows.slice(1)
    .filter(row => row[0])
    .map(row => ({
      divisionId: row[0] || '',
      divisionName: row[1] || '',
      color: row[2] || '#CFFF2E',
      bgClass: row[3] || 'bg-[#CFFF2E]',
      textClass: row[4] || 'text-[#0B3D2E]',
    }));
};

// Default divisions with colors (from PDF)
export const defaultDivisions: Division[] = [
  { divisionId: 'mens_open', divisionName: "MEN'S OPEN", color: '#EF4444', bgClass: 'bg-red-500', textClass: 'text-white' },
  { divisionId: 'mixed_open', divisionName: "MIXED OPEN", color: '#F97316', bgClass: 'bg-orange-500', textClass: 'text-white' },
  { divisionId: 'mens_senior', divisionName: "MEN'S SENIOR", color: '#A855F7', bgClass: 'bg-purple-500', textClass: 'text-white' },
  { divisionId: 'womens_open', divisionName: "WOMEN'S OPEN", color: '#22C55E', bgClass: 'bg-green-500', textClass: 'text-white' },
];

// Helper to get division styling
export const getDivisionStyle = (divisionName: string): Division => {
  const d = divisionName.toLowerCase();
  if (d.includes('men') && d.includes('senior')) return defaultDivisions[2];
  if (d.includes('men') && !d.includes('senior')) return defaultDivisions[0];
  if (d.includes('mixed')) return defaultDivisions[1];
  if (d.includes('women')) return defaultDivisions[3];
  return defaultDivisions[0];
};

// Helper to abbreviate division name
export const getAbbreviatedDivision = (division: string): string => {
  const d = division.toLowerCase();
  if (d.includes('mens') && d.includes('senior')) return 'MENS SENIOR';
  if (d.includes('mens')) return 'MENS';
  if (d.includes('mixed')) return 'MIXED';
  if (d.includes('women')) return 'WOMENS';
  return division.toUpperCase();
};
