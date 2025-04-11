
import { Match } from "../types";
import { AVAILABLE_SEASONS, TEAMS, teamNameToId } from "./constants";

// Function to fetch match data from a specific season or all seasons
export const fetchMatchData = async (seasonId?: string): Promise<Match[]> => {
  try {
    let urls: string[] = [];
    
    if (seasonId) {
      // Find the specific season
      const season = AVAILABLE_SEASONS.find(s => s.id === seasonId);
      if (!season) {
        throw new Error(`Season ${seasonId} not found`);
      }
      urls = [season.url];
    } else {
      // Use all seasons if no specific season is requested
      urls = AVAILABLE_SEASONS.map(s => s.url);
    }
    
    // Fetch and process all required CSV files
    const matchPromises = urls.map(async (url) => {
      const response = await fetch(url);
      const csvText = await response.text();
      return parseCsvToMatches(csvText, url);
    });
    
    // Combine all match results
    const allMatches = await Promise.all(matchPromises);
    return allMatches.flat();
  } catch (error) {
    console.error("Error fetching match data:", error);
    return [];
  }
};

// Helper function to parse CSV data into Match objects
export const parseCsvToMatches = (csvText: string, url: string): Match[] => {
  const matches: Match[] = [];
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  
  // Extract season ID from the URL
  const seasonId = url.split('/').pop()?.replace('.csv', '') || '0';
  
  // Skip header row if present
  const startIdx = lines[0].includes('date') || lines[0].includes('SEASON') ? 1 : 0;
  
  for (let i = startIdx; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      
      if (values.length >= 7) {
        const homeTeam = values[1];
        const awayTeam = values[2];
        const homeHalfTimeScore = parseInt(values[3], 10);
        const awayHalfTimeScore = parseInt(values[4], 10);
        const homeFullTimeScore = parseInt(values[5], 10);
        const awayFullTimeScore = parseInt(values[6], 10);
        
        // Only add match if we recognize both teams
        if (teamNameToId[homeTeam] && teamNameToId[awayTeam]) {
          matches.push({
            id: parseInt(`${seasonId}${i}`, 10),
            season: parseInt(seasonId, 10),
            matchday: Math.floor(i / 8) + 1, // Assuming 8 matches per matchday
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeTeamId: teamNameToId[homeTeam],
            awayTeamId: teamNameToId[awayTeam],
            homeHalfTimeScore,
            awayHalfTimeScore,
            homeFullTimeScore,
            awayFullTimeScore
          });
        }
      }
    } catch (error) {
      console.error(`Error parsing line ${i} in season ${seasonId}:`, error);
    }
  }
  
  return matches;
};

// Get all matches for a specific team
export const getTeamMatches = (teamId: string, matches: Match[]): Match[] => {
  // Find team name from ID
  const teamName = TEAMS.find(t => t.id === teamId)?.name;
  if (!teamName) return [];
  
  return matches.filter(match => 
    (match.homeTeamId === teamId || match.homeTeam === teamName) || 
    (match.awayTeamId === teamId || match.awayTeam === teamName)
  ).sort((a, b) => a.matchday - b.matchday);
};

// Get head-to-head matches between two teams
export const getHeadToHeadMatches = (team1Name: string, team2Name: string, matches: Match[]): Match[] => {
  if (!team1Name || !team2Name) return [];
  
  return matches.filter(match => 
    ((match.homeTeam === team1Name && match.awayTeam === team2Name) || 
     (match.homeTeam === team2Name && match.awayTeam === team1Name))
  ).sort((a, b) => a.matchday - b.matchday);
};
