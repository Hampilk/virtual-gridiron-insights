
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMatchData, generateLeagueTable } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";

const Standings = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
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
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load standings:", error);
        toast({
          title: "Error",
          description: "Failed to load standings data. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">League Standings</h1>
          <p className="text-gray-600">Current standings for all teams in the championship</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-football-accent"></div>
          </div>
        ) : (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Complete Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left">Pos</th>
                      <th className="px-4 py-3 text-left">Team</th>
                      <th className="px-4 py-3 text-center">P</th>
                      <th className="px-4 py-3 text-center">W</th>
                      <th className="px-4 py-3 text-center">D</th>
                      <th className="px-4 py-3 text-center">L</th>
                      <th className="px-4 py-3 text-center">GF</th>
                      <th className="px-4 py-3 text-center">GA</th>
                      <th className="px-4 py-3 text-center">GD</th>
                      <th className="px-4 py-3 text-center">Pts</th>
                      <th className="px-4 py-3 text-center">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr 
                        key={team.id} 
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">{index + 1}</td>
                        <td className="px-4 py-3">
                          <Link 
                            to={`/teams/${team.id}`} 
                            className="text-football-blue hover:text-football-accent"
                          >
                            {team.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">{team.played}</td>
                        <td className="px-4 py-3 text-center">{team.won}</td>
                        <td className="px-4 py-3 text-center">{team.drawn}</td>
                        <td className="px-4 py-3 text-center">{team.lost}</td>
                        <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                        <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                        <td className="px-4 py-3 text-center">{team.goalsFor - team.goalsAgainst}</td>
                        <td className="px-4 py-3 text-center font-bold">{team.points}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1 justify-center">
                            {team.form.map((result, i) => (
                              <span 
                                key={i} 
                                className={`inline-block w-6 h-6 text-xs flex items-center justify-center text-white font-bold rounded-full 
                                  ${result === 'W' ? 'bg-green-600' : result === 'D' ? 'bg-amber-500' : 'bg-red-600'}`}
                              >
                                {result}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-green-600 rounded-full mr-2"></span>
                  <span className="text-sm">Win</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
                  <span className="text-sm">Draw</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 bg-red-600 rounded-full mr-2"></span>
                  <span className="text-sm">Loss</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Standings;
