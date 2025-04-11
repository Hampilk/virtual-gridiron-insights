
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Goal, TrendingUp, BarChart2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Team } from "@/types";

interface TeamsListProps {
  teams: Team[];
  filteredTeams: Team[];
  selectedTeams: string[];
  loading: boolean;
  selectedSeason: string;
  handleTeamSelect: (teamId: string) => void;
}

const TeamsList = ({ 
  teams,
  filteredTeams,
  selectedTeams,
  loading,
  selectedSeason,
  handleTeamSelect 
}: TeamsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-football-accent"></div>
      </div>
    );
  }

  if (filteredTeams.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No teams found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTeams.map(team => (
        <TeamCard 
          key={team.id} 
          team={team} 
          teams={teams}
          isSelected={selectedTeams.includes(team.id)}
          onSelect={handleTeamSelect}
          selectedSeason={selectedSeason}
        />
      ))}
    </div>
  );
};

interface TeamCardProps {
  team: Team;
  teams: Team[];
  isSelected: boolean;
  onSelect: (teamId: string) => void;
  selectedSeason: string;
}

const TeamCard = ({ team, teams, isSelected, onSelect, selectedSeason }: TeamCardProps) => {
  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${isSelected ? 'ring-2 ring-football-accent' : ''}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {team.logoUrl && (
            <div className="h-8 w-8 overflow-hidden flex items-center justify-center">
              <img 
                src={team.logoUrl} 
                alt={`${team.name} logo`} 
                className="h-full w-auto object-contain"
              />
            </div>
          )}
          <CardTitle className="text-football-blue">{team.name}</CardTitle>
        </div>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(team.id)}
          aria-label={`Select ${team.name} for comparison`}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-sm text-gray-500">Position</div>
            <div className="text-2xl font-bold">
              {teams.findIndex(t => t.id === team.id) + 1}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Points</div>
            <div className="text-2xl font-bold">{team.points}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Goal Diff</div>
            <div className="text-2xl font-bold">
              {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
              {team.goalsFor - team.goalsAgainst}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="text-gray-500">W</div>
            <div className="font-medium">{team.won}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">D</div>
            <div className="font-medium">{team.drawn}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">L</div>
            <div className="font-medium">{team.lost}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">GF</div>
            <div className="font-medium">{team.goalsFor}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">GA</div>
            <div className="font-medium">{team.goalsAgainst}</div>
          </div>
        </div>
        
        <TeamFormDisplay form={team.form} />
        
        <div className="border-t pt-4">
          <div className="flex space-x-4">
            <div className="flex items-center text-sm">
              <Award className="text-football-accent h-4 w-4 mr-1" />
              <span>Comebacks: {team.comebacks}</span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="text-football-blue h-4 w-4 mr-1" />
              <span>HT Perf: {team.halfTimePerformance > 0 ? '+' : ''}{team.halfTimePerformance}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link 
          to={`/teams/${team.id}${selectedSeason ? `?season=${selectedSeason}` : ''}`} 
          className="flex-1 text-center py-2 bg-football-blue text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          View Details
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSelect(team.id)}
          className={isSelected ? "bg-football-accent text-white" : ""}
        >
          <BarChart2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

interface TeamFormDisplayProps {
  form: ('W' | 'D' | 'L')[];
}

const TeamFormDisplay = ({ form }: TeamFormDisplayProps) => {
  return (
    <div className="flex items-center justify-center gap-1 mt-2">
      {form.map((result, index) => (
        <span 
          key={index}
          className={`inline-block w-6 h-6 text-xs font-medium rounded-full flex items-center justify-center ${
            result === 'W' ? 'bg-green-500 text-white' :
            result === 'D' ? 'bg-amber-400 text-white' :
            'bg-red-500 text-white'
          }`}
        >
          {result}
        </span>
      ))}
    </div>
  );
};

export default TeamsList;
