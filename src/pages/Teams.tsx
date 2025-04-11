
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { fetchMatchData, generateLeagueTable } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Award, Goal, TrendingUp } from "lucide-react";

const Teams = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const matchData = await fetchMatchData();
        setMatches(matchData);
        
        if (matchData.length > 0) {
          const tableData = generateLeagueTable(matchData);
          setTeams(tableData);
          setFilteredTeams(tableData);
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
  }, [toast]);

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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">Teams</h1>
          <p className="text-gray-600">Explore all teams in the championship</p>
        </div>
        
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-football-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map(team => (
              <Card key={team.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-football-blue">{team.name}</CardTitle>
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
                <CardFooter>
                  <Link 
                    to={`/teams/${team.id}`} 
                    className="w-full text-center py-2 bg-football-blue text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    View Details
                  </Link>
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
