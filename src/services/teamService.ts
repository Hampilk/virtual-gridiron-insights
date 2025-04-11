import { Match, Team, TeamStatistics } from "../types";
import { TEAMS } from "./constants";

// Generate league table based on match data
export const generateLeagueTable = (matches: Match[]): Team[] => {
  const teamStats: Record<string, Team> = {};
  
  // Initialize all teams with their proper IDs and names
  TEAMS.forEach(team => {
    teamStats[team.id] = createInitialTeamStats(team.id, team.name, team.logoUrl);
  });
  
  // Process each match to calculate team stats
  matches.forEach(match => {
    const homeTeamId = match.homeTeamId;
    const awayTeamId = match.awayTeamId;
    
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

// Get a team by ID
export const getTeamById = (teamId: string): { id: string, name: string, logoUrl: string } | undefined => {
  return TEAMS.find(team => team.id === teamId);
};

// Helper functions
export const createInitialTeamStats = (teamId: string, teamName: string, logoUrl?: string): Team => ({
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

export const updateHalfTimePerformance = (
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
