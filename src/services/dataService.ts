
import { Match, Team, TeamStatistics } from "../types";

// List of all teams with their proper information
export const TEAMS = [
  { id: "arsenal", name: "London Ágyúk", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", weight: 1.0, league: "premier-league" },
  { id: "astonvilla", name: "Aston Oroszlán", logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_FC_crest.svg", league: "premier-league" },
  { id: "brentford", name: "Brentford", logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg", league: "premier-league" },
  { id: "brighton", name: "Brighton", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg", league: "premier-league" },
  { id: "chelsea", name: "Chelsea", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg", weight: 0.9, league: "premier-league" },
  { id: "palace", name: "Crystal Palace", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg", league: "premier-league" },
  { id: "everton", name: "Everton", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg", league: "premier-league" },
  { id: "fulham", name: "Fulham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/3e/Fulham_FC_%28shield%29.svg", league: "premier-league" },
  { id: "liverpool", name: "Liverpool", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg", weight: 0.9, league: "premier-league" },
  { id: "mancity", name: "Manchester Kék", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", weight: 0.8, league: "premier-league" },
  { id: "newcastle", name: "Newcastle", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg", league: "premier-league" },
  { id: "nottingham", name: "Nottingham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_FC_logo.svg", league: "premier-league" },
  { id: "tottenham", name: "Tottenham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg", weight: 1.1, league: "premier-league" },
  { id: "manutd", name: "Vörös Ördögök", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", weight: 0.9, league: "premier-league" },
  { id: "westham", name: "West Ham", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg", league: "premier-league" },
  { id: "wolves", name: "Wolverhampton", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg", league: "premier-league" },
].sort((a, b) => a.name.localeCompare(b.name));

// Map team names from CSV to team IDs
const teamNameToId: Record<string, string> = {
  "London Ágyúk": "arsenal",
  "Aston Oroszlán": "astonvilla",
  "Brentford": "brentford",
  "Brighton": "brighton",
  "Chelsea": "chelsea",
  "Crystal Palace": "palace",
  "Everton": "everton",
  "Fulham": "fulham",
  "Liverpool": "liverpool",
  "Manchester Kék": "mancity",
  "Newcastle": "newcastle",
  "Nottingham": "nottingham",
  "Tottenham": "tottenham",
  "Vörös Ördögök": "manutd",
  "West Ham": "westham",
  "Wolverhampton": "wolves"
};

// Available season data URLs
export const AVAILABLE_SEASONS = [
  { id: "20320", name: "2032/0", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20320.csv" },
  { id: "20321", name: "2032/1", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20321.csv" },
  { id: "20322", name: "2032/2", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20322.csv" },
  { id: "20323", name: "2032/3", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20323.csv" },
  { id: "20324", name: "2032/4", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20324.csv" },
  { id: "20325", name: "2032/5", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20325.csv" },
  { id: "20326", name: "2032/6", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20326.csv" },
  { id: "20327", name: "2032/7", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20327.csv" },
  { id: "20328", name: "2032/8", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20328.csv" },
  { id: "20329", name: "2032/9", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20329.csv" },
  { id: "20330", name: "2033/0", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20330.csv" },
  { id: "20331", name: "2033/1", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20331.csv" },
  { id: "20332", name: "2033/2", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20332.csv" },
  { id: "20333", name: "2033/3", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20333.csv" },
  { id: "20334", name: "2033/4", url: "https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20334.csv" }
];

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
const parseCsvToMatches = (csvText: string, url: string): Match[] => {
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

// Generate league table based on match data
export const generateLeagueTable = (matches: Match[]): Team[] => {
  const teamStats: Record<string, Team> = {};
  
  // Initialize all teams with their proper IDs and names
  TEAMS.forEach(team => {
    teamStats[team.id] = createInitialTeamStats(team.id, team.name, team.logoUrl);
  });
  
  // Process each match to calculate team stats
  matches.forEach(match => {
    const homeTeamId = match.homeTeamId || teamNameToId[match.homeTeam];
    const awayTeamId = match.awayTeamId || teamNameToId[match.awayTeam];
    
    // Skip if we can't identify the teams
    if (!homeTeamId || !awayTeamId) return;
    
    // Update home team stats
    const homeTeam = teamStats[homeTeamId];
    homeTeam.played += 1;
    homeTeam.goalsFor += match.homeFullTimeScore;
    homeTeam.goalsAgainst += match.awayFullTimeScore;
    
    // Update away team stats
    const awayTeam = teamStats[awayTeamId];
    awayTeam.played += 1;
    awayTeam.goalsFor += match.awayFullTimeScore;
    awayTeam.goalsAgainst += match.homeFullTimeScore;
    
    // Determine match result and update accordingly
    if (match.homeFullTimeScore > match.awayFullTimeScore) {
      // Home win
      homeTeam.won += 1;
      homeTeam.points += 3;
      homeTeam.form.push('W');
      
      awayTeam.lost += 1;
      awayTeam.form.push('L');
      
      // Check for comeback
      if (match.homeHalfTimeScore < match.awayHalfTimeScore) {
        homeTeam.comebacks += 1;
      }
    } else if (match.homeFullTimeScore < match.awayFullTimeScore) {
      // Away win
      awayTeam.won += 1;
      awayTeam.points += 3;
      awayTeam.form.push('W');
      
      homeTeam.lost += 1;
      homeTeam.form.push('L');
      
      // Check for comeback
      if (match.awayHalfTimeScore < match.homeHalfTimeScore) {
        awayTeam.comebacks += 1;
      }
    } else {
      // Draw
      homeTeam.drawn += 1;
      homeTeam.points += 1;
      homeTeam.form.push('D');
      
      awayTeam.drawn += 1;
      awayTeam.points += 1;
      awayTeam.form.push('D');
    }
    
    // Calculate half-time performance
    updateHalfTimePerformance(homeTeam, match.homeHalfTimeScore, match.awayHalfTimeScore, 
                             match.homeFullTimeScore, match.awayFullTimeScore, true);
    updateHalfTimePerformance(awayTeam, match.awayHalfTimeScore, match.homeHalfTimeScore, 
                             match.awayFullTimeScore, match.homeFullTimeScore, false);
  });
  
  // Convert to array and sort by points (and goal difference as tiebreaker)
  const teamsArray = Object.values(teamStats);
  
  teamsArray.sort((a, b) => {
    // First sort by points
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    
    // Then by goal difference
    const aGoalDiff = a.goalsFor - a.goalsAgainst;
    const bGoalDiff = b.goalsFor - b.goalsAgainst;
    
    if (bGoalDiff !== aGoalDiff) {
      return bGoalDiff - aGoalDiff;
    }
    
    // Then by goals scored
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    
    // Finally alphabetically
    return a.name.localeCompare(b.name);
  });
  
  // Only keep the last 5 form results
  teamsArray.forEach(team => {
    team.form = team.form.slice(-5);
  });
  
  return teamsArray;
};

// Get detailed stats for a specific team
export const getTeamStatistics = (teamId: string, matches: Match[]): TeamStatistics => {
  const stats: TeamStatistics = {
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    cleanSheets: 0,
    comebacks: 0,
    pointsFromLosing: 0,
    halfTimeLeads: 0,
    halfTimeDraws: 0,
    halfTimeDeficits: 0,
    homeWins: 0,
    homeDraws: 0,
    homeLosses: 0,
    awayWins: 0,
    awayDraws: 0,
    awayLosses: 0,
    firstHalfGoals: 0,
    secondHalfGoals: 0,
    matchesWonFromTrailing: 0,
    matchesLostFromLeading: 0
  };
  
  // Get team name from ID
  const teamName = TEAMS.find(t => t.id === teamId)?.name;
  if (!teamName) return stats;
  
  // Filter matches for the specific team
  const teamMatches = matches.filter(
    match => (match.homeTeamId === teamId || match.homeTeam === teamName) || 
             (match.awayTeamId === teamId || match.awayTeam === teamName)
  );
  
  teamMatches.forEach(match => {
    stats.matchesPlayed++;
    
    const isHome = (match.homeTeamId === teamId || match.homeTeam === teamName);
    const teamHalfTimeScore = isHome ? match.homeHalfTimeScore : match.awayHalfTimeScore;
    const opponentHalfTimeScore = isHome ? match.awayHalfTimeScore : match.homeHalfTimeScore;
    const teamFullTimeScore = isHome ? match.homeFullTimeScore : match.awayFullTimeScore;
    const opponentFullTimeScore = isHome ? match.awayFullTimeScore : match.homeFullTimeScore;
    
    // Update goals stats
    stats.goalsFor += teamFullTimeScore;
    stats.goalsAgainst += opponentFullTimeScore;
    
    // First half and second half goals
    stats.firstHalfGoals += teamHalfTimeScore;
    stats.secondHalfGoals += (teamFullTimeScore - teamHalfTimeScore);
    
    // Clean sheets
    if (opponentFullTimeScore === 0) {
      stats.cleanSheets++;
    }
    
    // Half-time situation
    if (teamHalfTimeScore > opponentHalfTimeScore) {
      stats.halfTimeLeads++;
      // Check if lost from leading
      if (teamFullTimeScore < opponentFullTimeScore) {
        stats.matchesLostFromLeading++;
      }
    } else if (teamHalfTimeScore === opponentHalfTimeScore) {
      stats.halfTimeDraws++;
    } else {
      stats.halfTimeDeficits++;
      // Check if won from trailing
      if (teamFullTimeScore > opponentFullTimeScore) {
        stats.matchesWonFromTrailing++;
      }
    }
    
    // Match result
    if (teamFullTimeScore > opponentFullTimeScore) {
      stats.wins++;
      
      // Home or away win
      if (isHome) {
        stats.homeWins++;
      } else {
        stats.awayWins++;
      }
      
      // Comeback win
      if (teamHalfTimeScore < opponentHalfTimeScore) {
        stats.comebacks++;
        stats.pointsFromLosing += 3;
      }
    } else if (teamFullTimeScore === opponentFullTimeScore) {
      stats.draws++;
      
      // Home or away draw
      if (isHome) {
        stats.homeDraws++;
      } else {
        stats.awayDraws++;
      }
      
      // Comeback draw
      if (teamHalfTimeScore < opponentHalfTimeScore) {
        stats.pointsFromLosing += 1;
      }
    } else {
      stats.losses++;
      
      // Home or away loss
      if (isHome) {
        stats.homeLosses++;
      } else {
        stats.awayLosses++;
      }
    }
  });
  
  return stats;
};

// Get all matches for a specific team
export const getTeamMatches = (teamId: string, matches: Match[]): Match[] => {
  const teamName = TEAMS.find(t => t.id === teamId)?.name;
  if (!teamName) return [];
  
  return matches.filter(match => 
    (match.homeTeamId === teamId || match.homeTeam === teamName) || 
    (match.awayTeamId === teamId || match.awayTeam === teamName)
  ).sort((a, b) => a.matchday - b.matchday);
};

// Get head-to-head matches between two teams
export const getHeadToHeadMatches = (team1Id: string, team2Id: string, matches: Match[]): Match[] => {
  const team1Name = TEAMS.find(t => t.id === team1Id)?.name;
  const team2Name = TEAMS.find(t => t.id === team2Id)?.name;
  
  if (!team1Name || !team2Name) return [];
  
  return matches.filter(match => 
    ((match.homeTeamId === team1Id || match.homeTeam === team1Name) && 
     (match.awayTeamId === team2Id || match.awayTeam === team2Name)) || 
    ((match.homeTeamId === team2Id || match.homeTeam === team2Name) && 
     (match.awayTeamId === team1Id || match.awayTeam === team1Name))
  ).sort((a, b) => a.matchday - b.matchday);
};

// Get a team by ID
export const getTeamById = (teamId: string): { id: string, name: string, logoUrl: string } | undefined => {
  return TEAMS.find(team => team.id === teamId);
};

// Helper functions
const createInitialTeamStats = (teamId: string, teamName: string, logoUrl?: string): Team => ({
  id: teamId,
  name: teamName,
  logoUrl: logoUrl,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
  form: [],
  comebacks: 0,
  halfTimePerformance: 0
});

const updateHalfTimePerformance = (
  team: Team, 
  teamHalfTimeScore: number, 
  opponentHalfTimeScore: number,
  teamFullTimeScore: number,
  opponentFullTimeScore: number,
  isHome: boolean
) => {
  // Calculate hypothetical half-time points
  let halfTimePoints = 0;
  if (teamHalfTimeScore > opponentHalfTimeScore) {
    halfTimePoints = 3;
  } else if (teamHalfTimeScore === opponentHalfTimeScore) {
    halfTimePoints = 1;
  }
  
  // Calculate actual full-time points
  let fullTimePoints = 0;
  if (teamFullTimeScore > opponentFullTimeScore) {
    fullTimePoints = 3;
  } else if (teamFullTimeScore === opponentFullTimeScore) {
    fullTimePoints = 1;
  }
  
  // Update half-time performance metric (can be positive or negative)
  team.halfTimePerformance += (fullTimePoints - halfTimePoints);
};
