
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Team } from "@/types";

interface TeamSelectorProps {
  teamNumber: 1 | 2;
  selectedTeamId: string | null;
  onTeamChange: (value: string) => void;
  teams: Team[];
  selectedTeam: Team | null;
}

const TeamSelector = ({ 
  teamNumber, 
  selectedTeamId, 
  onTeamChange, 
  teams, 
  selectedTeam 
}: TeamSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team {teamNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedTeamId || undefined} onValueChange={onTeamChange}>
          <SelectTrigger>
            <SelectValue placeholder={`Select team ${teamNumber}`} />
          </SelectTrigger>
          <SelectContent>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedTeam && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold text-football-blue">{selectedTeam.name}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-sm">Position: {teams.findIndex(t => t.id === selectedTeam.id) + 1}</div>
              <div className="text-sm">Points: {selectedTeam.points}</div>
              <div className="text-sm">Form: 
                <span className="ml-1">
                  {selectedTeam.form.map((result, i) => (
                    <span 
                      key={i} 
                      className={`inline-block w-5 h-5 text-xs mx-0.5 flex items-center justify-center text-white font-bold rounded-full 
                        ${result === 'W' ? 'bg-green-600' : result === 'D' ? 'bg-amber-500' : 'bg-red-600'}`}
                    >
                      {result}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to={`/teams/${selectedTeam.id}`}>View Team Details</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamSelector;
