
export interface Match {
  id: number;
  matchday: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeHalfTimeScore: number;
  awayHalfTimeScore: number;
  homeFullTimeScore: number;
  awayFullTimeScore: number;
  season: number;
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  weight?: number;
  league?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  comebacks: number;
  halfTimePerformance: number;
  homeWins?: number;
  homeLosses?: number;
  homeDraws?: number;
  awayWins?: number;
  awayLosses?: number;
  awayDraws?: number;
  secondHalfGoals?: number;
  firstHalfGoals?: number;
}

export interface TeamStatistics {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  comebacks: number;
  pointsFromLosing: number;
  halfTimeLeads: number;
  halfTimeDraws: number;
  halfTimeDeficits: number;
  homeWins: number;
  homeDraws: number;
  homeLosses: number;
  awayWins: number;
  awayDraws: number;
  awayLosses: number;
  firstHalfGoals: number;
  secondHalfGoals: number;
  matchesWonFromTrailing: number;
  matchesLostFromLeading: number;
}
