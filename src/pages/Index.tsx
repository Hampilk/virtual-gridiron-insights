
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { fetchMatchData, generateLeagueTable, getTeamStatistics } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight } from "lucide-react";

const Index = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
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
          
          // Get last 5 matches
          const sortedMatches = [...matchData].sort((a, b) => {
            // Sort by matchday descending
            return b.matchday - a.matchday;
          });
          
          setRecentMatches(sortedMatches.slice(0, 5));
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Prepare data for top scorers chart
  const topScoringTeamsData = [...teams]
    .sort((a, b) => b.goalsFor - a.goalsFor)
    .slice(0, 5)
    .map(team => ({
      name: team.name,
      goals: team.goalsFor
    }));

  // Prepare data for comeback kings chart
  const comebackKingsData = [...teams]
    .sort((a, b) => b.comebacks - a.comebacks)
    .slice(0, 5)
    .map(team => ({
      name: team.name,
      comebacks: team.comebacks
    }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">Virtual Gridiron Insights</h1>
          <p className="text-gray-600">Your ultimate analysis platform for virtual football championships</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-football-accent"></div>
          </div>
        ) : (
          <>
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-football-blue text-lg">Total Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-football-accent">{teams.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-football-blue text-lg">Total Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-football-accent">{matches.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-football-blue text-lg">Goals Scored</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-football-accent">
                    {teams.reduce((sum, team) => sum + team.goalsFor, 0)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-football-blue text-lg">Average Goals/Match</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-football-accent">
                    {matches.length > 0 
                      ? (teams.reduce((sum, team) => sum + team.goalsFor, 0) / matches.length).toFixed(2) 
                      : "0"}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Top Scoring Teams</CardTitle>
                  <CardDescription>Teams with the most goals scored</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topScoringTeamsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="goals" fill="#38bdf8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Comeback Kings</CardTitle>
                  <CardDescription>Teams with the most comebacks from losing positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comebackKingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="comebacks" fill="#1a5d1a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Matches */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Matches</CardTitle>
                  <CardDescription>Latest results from the championship</CardDescription>
                </div>
                <Link 
                  to="/matches" 
                  className="text-football-accent hover:text-football-blue flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMatches.map(match => (
                    <div 
                      key={match.id} 
                      className="match-card flex justify-between items-center"
                    >
                      <div className="flex-1 text-right pr-4">
                        <span className="font-medium">{match.homeTeam}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold">{match.homeFullTimeScore}</span>
                        <span className="text-sm text-gray-500">-</span>
                        <span className="text-xl font-bold">{match.awayFullTimeScore}</span>
                      </div>
                      
                      <div className="flex-1 text-left pl-4">
                        <span className="font-medium">{match.awayTeam}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Standings Preview */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Standings</CardTitle>
                  <CardDescription>Top 5 teams in the league</CardDescription>
                </div>
                <Link 
                  to="/standings" 
                  className="text-football-accent hover:text-football-blue flex items-center"
                >
                  Full Table <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-2 py-3 text-left">Pos</th>
                        <th className="px-2 py-3 text-left">Team</th>
                        <th className="px-2 py-3 text-center">P</th>
                        <th className="px-2 py-3 text-center">W</th>
                        <th className="px-2 py-3 text-center">D</th>
                        <th className="px-2 py-3 text-center">L</th>
                        <th className="px-2 py-3 text-center">GF</th>
                        <th className="px-2 py-3 text-center">GA</th>
                        <th className="px-2 py-3 text-center">GD</th>
                        <th className="px-2 py-3 text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.slice(0, 5).map((team, index) => (
                        <tr 
                          key={team.id} 
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-2 py-3 font-medium">{index + 1}</td>
                          <td className="px-2 py-3">
                            <Link 
                              to={`/teams/${team.id}`} 
                              className="text-football-blue hover:text-football-accent"
                            >
                              {team.name}
                            </Link>
                          </td>
                          <td className="px-2 py-3 text-center">{team.played}</td>
                          <td className="px-2 py-3 text-center">{team.won}</td>
                          <td className="px-2 py-3 text-center">{team.drawn}</td>
                          <td className="px-2 py-3 text-center">{team.lost}</td>
                          <td className="px-2 py-3 text-center">{team.goalsFor}</td>
                          <td className="px-2 py-3 text-center">{team.goalsAgainst}</td>
                          <td className="px-2 py-3 text-center">{team.goalsFor - team.goalsAgainst}</td>
                          <td className="px-2 py-3 text-center font-bold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
