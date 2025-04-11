
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchMatchData, generateLeagueTable, TEAMS, AVAILABLE_SEASONS } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Award, Goal, TrendingUp, BarChart2, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Teams = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const matchData = await fetchMatchData(selectedSeason || undefined);
        setMatches(matchData);
        
        if (matchData.length > 0) {
          const tableData = generateLeagueTable(matchData);
          setTeams(tableData);
          setFilteredTeams(tableData);
        } else {
          toast({
            title: "No matches found",
            description: selectedSeason 
              ? `No matches found for the selected season.` 
              : "No matches found. Please check the data source.",
            variant: "destructive"
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load teams:", error);
        toast({
          title: "Error",
          description: "Failed to load teams data. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast, selectedSeason]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeams(teams);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTeams(
        teams.filter(team => team.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, teams]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      }
      
      if (prev.length >= 2) {
        return [prev[0], teamId];
      }
      
      return [...prev, teamId];
    });
  };

  const handleCompareClick = () => {
    if (selectedTeams.length === 2) {
      navigate(`/head-to-head?team1=${selectedTeams[0]}&team2=${selectedTeams[1]}${selectedSeason ? `&season=${selectedSeason}` : ''}`);
    } else if (selectedTeams.length === 1) {
      toast({
        title: "Select another team",
        description: "Please select one more team to compare.",
        variant: "default"
      });
    } else {
      toast({
        title: "No teams selected",
        description: "Please select two teams to compare.",
        variant: "default"
      });
    }
  };

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">Teams</h1>
          <p className="text-gray-600">Explore all teams in the championship</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <div className="w-full max-w-md">
              <Input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="w-full max-w-xs">
              <Select value={selectedSeason} onValueChange={handleSeasonChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All seasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-seasons">All seasons</SelectItem>
                  {AVAILABLE_SEASONS.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTeams.length > 0 && (
            <div className="flex items-center">
              <Button 
                onClick={handleCompareClick}
                variant="outline"
                className="flex items-center"
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Compare Selected Teams ({selectedTeams.length}/2)
              </Button>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-football-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <Card key={team.id} className={`shadow-md hover:shadow-lg transition-shadow duration-300 ${selectedTeams.includes(team.id) ? 'ring-2 ring-football-accent' : ''}`}>
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
                    checked={selectedTeams.includes(team.id)}
                    onCheckedChange={() => handleTeamSelect(team.id)}
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
                  
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {team.form.map((result, index) => (
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
                    onClick={() => handleTeamSelect(team.id)}
                    className={selectedTeams.includes(team.id) ? "bg-football-accent text-white" : ""}
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredTeams.length === 0 && !loading && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No teams found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Teams;
