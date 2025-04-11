
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, CalendarDays } from "lucide-react";
import { Match, Team } from "@/types";

interface HeadToHeadRecordProps {
  team1: Team;
  team2: Team;
  headToHeadMatches: Match[];
  h2hRecord: {
    team1Wins: number;
    team2Wins: number;
    draws: number;
  };
}

const HeadToHeadRecord = ({ team1, team2, headToHeadMatches, h2hRecord }: HeadToHeadRecordProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          Head-to-Head Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center text-center">
          <div className="w-1/3">
            <h3 className="font-semibold text-football-blue">{team1.name}</h3>
            <p className="text-3xl font-bold">{h2hRecord.team1Wins}</p>
            <p className="text-sm text-gray-500">Wins</p>
          </div>
          
          <div className="w-1/3">
            <h3 className="font-semibold text-amber-500">Draws</h3>
            <p className="text-3xl font-bold">{h2hRecord.draws}</p>
            <p className="text-sm text-gray-500">Matches</p>
          </div>
          
          <div className="w-1/3">
            <h3 className="font-semibold text-football-blue">{team2.name}</h3>
            <p className="text-3xl font-bold">{h2hRecord.team2Wins}</p>
            <p className="text-sm text-gray-500">Wins</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2 flex items-center">
            <CalendarDays className="h-4 w-4 mr-2" />
            Recent Meetings
          </h3>
          
          {headToHeadMatches.length > 0 ? (
            <div className="space-y-2">
              {headToHeadMatches.map(match => {
                const isTeam1Home = match.homeTeam === team1.name;
                const team1Score = isTeam1Home ? match.homeFullTimeScore : match.awayFullTimeScore;
                const team2Score = isTeam1Home ? match.awayFullTimeScore : match.homeFullTimeScore;
                
                return (
                  <div key={match.id} className="flex justify-between items-center border-b pb-2">
                    <div className="text-sm">Matchday {match.matchday}</div>
                    <div className="flex items-center">
                      <span className={`font-semibold ${isTeam1Home ? 'font-semibold' : ''}`}>{team1.name}</span>
                      <span className="mx-2 text-lg font-bold">{team1Score}</span>
                      <span className="text-sm">-</span>
                      <span className="mx-2 text-lg font-bold">{team2Score}</span>
                      <span className={`font-semibold ${!isTeam1Home ? 'font-semibold' : ''}`}>{team2.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      HT: {isTeam1Home ? match.homeHalfTimeScore : match.awayHalfTimeScore} - 
                      {isTeam1Home ? match.awayHalfTimeScore : match.homeHalfTimeScore}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No head-to-head matches found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadToHeadRecord;
