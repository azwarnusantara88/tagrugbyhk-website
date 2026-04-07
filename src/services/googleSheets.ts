import { cache } from 'react';

// Revalidate every 5 minutes
export const revalidate = 300;

const SHEET_ID = '1AertW5yTqPz0Sbzxe2ODF74CikTY_hQS9KMbQSsWkuM';

// Sheet GIDs
const SHEET_GIDS = {
  FIXTURES: '0',
  TEAMS: '1275974115',
  STANDINGS: '1885819712',
  LOCATIONS: '114025676',
  INFORMATION: '1244739706',
  ANNOUNCEMENTS: '1344579919',
  SPONSORS: '1444420132',
};

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
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
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
export async function getFixtures() {
  const data = await fetchSheetData(SHEET_GIDS.FIXTURES);
  
  return data.map((row: any) => ({
    date: row.Date || '',
    time: row.Time || '',
    division: row.Division || '',
    homeTeamId: row.HomeTeamID || '',
    homeTeam: row.HomeTeam || '',
    homeScore: row.HomeScore || '',
    awayTeamId: row.AwayTeamID || '',
    awayTeam: row.AwayTeam || '',
    awayScore: row.AwayScore || '',
    venue: row.Venue || '',
    pitch: row.Pitch || '',
    matchType: row.MatchType || '',
    round: row.Round || '',
    completed: row.Completed === 'TRUE' || row.Completed === 'true',
  }));
}

// Fetch teams data with logo support
export async function getTeams() {
  const data = await fetchSheetData(SHEET_GIDS.TEAMS);
  
  return data.map((row: any) => ({
    teamId: row.TeamID || '',
    teamName: row.TeamName || '',
    division: row.Division || '',
    logoUrl: extractImageUrl(row.LOGO || ''),
  }));
}

// Fetch standings data
export async function getStandings() {
  const data = await fetchSheetData(SHEET_GIDS.STANDINGS);
  
  return data.map((row: any) => ({
    division: row.Division || '',
    position: parseInt(row.Position) || 0,
    team: row.Team || '',
    played: parseInt(row.Played) || 0,
    won: parseInt(row.Won) || 0,
    drawn: parseInt(row.Drawn) || 0,
    lost: parseInt(row.Lost) || 0,
    pointsFor: parseInt(row.PointsFor) || 0,
    pointsAgainst: parseInt(row.PointsAgainst) || 0,
    pointsDifference: parseInt(row.PointsDifference) || 0,
    bonusPoints: parseInt(row.BonusPoints) || 0,
    totalPoints: parseInt(row.TotalPoints) || 0,
  }));
}

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
