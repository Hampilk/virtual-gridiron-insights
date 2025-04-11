import { Match, Team, TeamStatistics } from "../types";

// Function to fetch match data from the CSV
export const fetchMatchData = async (): Promise<Match[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Winmix713/legamecs/refs/heads/main/20320.csv');
    const csvText = await response.text();
    
    // Parse CSV into match objects
    const matches: Match[] = [];
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    
    // Skip header row if present
    const startIdx = lines[0].includes('SEASON') ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      if (values.length >= 8) {
        matches.push({
          id: i,
          season: parseInt(values[0], 10),
          matchday: parseInt(values[1], 10),
          homeTeam: values[2],
          awayTeam: values[3],
          homeHalfTimeScore: parseInt(values[4], 10),
          awayHalfTimeScore: parseInt(values[5], 10),
          homeFullTimeScore: parseInt(values[6], 10),
          awayFullTimeScore: parseInt(values[7], 10)
        });
      }
    }
    
    return matches;
  } catch (error) {
    console.error("Error fetching match data:", error);
    return [];
  }
};

// Generate league table
export const generateLeagueTable = (matches: Match[]): Team[] => {
  const teamStats: Record<string, Team> = {};
  
  // Process each match to calculate team stats
  matches.forEach(match => {
    // Ensure home team exists in our records
    if (!teamStats[match.homeTeam]) {
      teamStats[match.homeTeam] = createInitialTeamStats(match.homeTeam);
    }
    
    // Ensure away team exists in our records
    if (!teamStats[match.awayTeam]) {
      teamStats[match.awayTeam] = createInitialTeamStats(match.awayTeam);
    }
    
    // Update home team stats
    const homeTeam = teamStats[match.homeTeam];
    homeTeam.played += 1;
    homeTeam.goalsFor += match.homeFullTimeScore;
    homeTeam.goalsAgainst += match.awayFullTimeScore;
    
    // Update away team stats
    const awayTeam = teamStats[match.awayTeam];
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
    
    // Calculate half-time performance (points gained/lost from half-time to full-time)
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
export const getTeamStatistics = (teamName: string, matches: Match[]): TeamStatistics => {
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
    halfTimeDeficits: 0
  };
  
  // Filter matches for the specific team
  const teamMatches = matches.filter(
    match => match.homeTeam === teamName || match.awayTeam === teamName
  );
  
  teamMatches.forEach(match => {
    stats.matchesPlayed++;
    
    const isHome = match.homeTeam === teamName;
    const teamHalfTimeScore = isHome ? match.homeHalfTimeScore : match.awayHalfTimeScore;
    const opponentHalfTimeScore = isHome ? match.awayHalfTimeScore : match.homeHalfTimeScore;
    const teamFullTimeScore = isHome ? match.homeFullTimeScore : match.awayFullTimeScore;
    const opponentFullTimeScore = isHome ? match.awayFullTimeScore : match.homeFullTimeScore;
    
    // Update goals stats
    stats.goalsFor += teamFullTimeScore;
    stats.goalsAgainst += opponentFullTimeScore;
    
    // Clean sheets
    if (opponentFullTimeScore === 0) {
      stats.cleanSheets++;
    }
    
    // Half-time situation
    if (teamHalfTimeScore > opponentHalfTimeScore) {
      stats.halfTimeLeads++;
    } else if (teamHalfTimeScore === opponentHalfTimeScore) {
      stats.halfTimeDraws++;
    } else {
      stats.halfTimeDeficits++;
    }
    
    // Match result
    if (teamFullTimeScore > opponentFullTimeScore) {
      stats.wins++;
      // Comeback win
      if (teamHalfTimeScore < opponentHalfTimeScore) {
        stats.comebacks++;
        stats.pointsFromLosing += 3;
      }
    } else if (teamFullTimeScore === opponentFullTimeScore) {
      stats.draws++;
      // Comeback draw
      if (teamHalfTimeScore < opponentHalfTimeScore) {
        stats.pointsFromLosing += 1;
      }
    } else {
      stats.losses++;
    }
  });
  
  return stats;
};

// Get all matches for a specific team
export const getTeamMatches = (teamName: string, matches: Match[]): Match[] => {
  return matches.filter(match => 
    match.homeTeam === teamName || match.awayTeam === teamName
  ).sort((a, b) => a.matchday - b.matchday);
};

// Get head-to-head matches between two teams
export const getHeadToHeadMatches = (team1: string, team2: string, matches: Match[]): Match[] => {
  return matches.filter(match => 
    (match.homeTeam === team1 && match.awayTeam === team2) || 
    (match.homeTeam === team2 && match.awayTeam === team1)
  ).sort((a, b) => a.matchday - b.matchday);
};

// Helper functions
const createInitialTeamStats = (teamName: string): Team => ({
  id: teamName.toLowerCase().replace(/\s+/g, '-'),
  name: teamName,
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
