
import { Match, Team } from "@/types";

export const prepareComparisonData = (team1: Team, team2: Team) => {
  return [
    { name: 'Points', team1: team1.points, team2: team2.points },
    { name: 'Wins', team1: team1.won, team2: team2.won },
    { name: 'Draws', team1: team1.drawn, team2: team2.drawn },
    { name: 'Losses', team1: team1.lost, team2: team2.lost },
    { name: 'Goals For', team1: team1.goalsFor, team2: team2.goalsFor },
    { name: 'Goals Against', team1: team1.goalsAgainst, team2: team2.goalsAgainst },
    { name: 'Comebacks', team1: team1.comebacks, team2: team2.comebacks },
  ];
};

export const calculateH2HRecord = (team1: Team | null, team2: Team | null, headToHeadMatches: Match[]) => {
  if (!team1 || !team2 || headToHeadMatches.length === 0) {
    return { team1Wins: 0, team2Wins: 0, draws: 0 };
  }
  
  let team1Wins = 0;
  let team2Wins = 0;
  let draws = 0;
  
  headToHeadMatches.forEach(match => {
    const isTeam1Home = match.homeTeam === team1.name;
    const team1Score = isTeam1Home ? match.homeFullTimeScore : match.awayFullTimeScore;
    const team2Score = isTeam1Home ? match.awayFullTimeScore : match.homeFullTimeScore;
    
    if (team1Score > team2Score) {
      team1Wins++;
    } else if (team1Score < team2Score) {
      team2Wins++;
    } else {
      draws++;
    }
  });
  
  return { team1Wins, team2Wins, draws };
};
