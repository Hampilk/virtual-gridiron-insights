
export interface Match {
  id: number;
  matchday: number;
  homeTeam: string;
  awayTeam: string;
  homeHalfTimeScore: number;
  awayHalfTimeScore: number;
  homeFullTimeScore: number;
  awayFullTimeScore: number;
  season: number;
}

export interface Team {
  id: string;
  name: string;
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
}
