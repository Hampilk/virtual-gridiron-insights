
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchMatchData, generateLeagueTable, getHeadToHeadMatches, getTeamStatistics } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Trophy, ArrowLeftRight, CalendarDays, Goal } from "lucide-react";

const HeadToHead = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [headToHeadMatches, setHeadToHeadMatches] = useState<Match[]>([]);
  const [team1Id, setTeam1Id] = useState<string | null>(searchParams.get("team1"));
  const [team2Id, setTeam2Id] = useState<string | null>(searchParams.get("team2"));
  const [team1, setTeam1] = useState<Team | null>(null);
  const [team2, setTeam2] = useState<Team | null>(null);
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
          
          // Set initial teams if provided in URL
          if (team1Id && team2Id) {
            const t1 = tableData.find(t => t.id === team1Id) || null;
            const t2 = tableData.find(t => t.id === team2Id) || null;
            setTeam1(t1);
            setTeam2(t2);
            
            if (t1 && t2) {
              const h2hMatches = getHeadToHeadMatches(t1.name, t2.name, matchData);
              setHeadToHeadMatches(h2hMatches);
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load head-to-head data:", error);
        toast({
          title: "Error",
          description: "Failed to load comparison data. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [team1Id, team2Id, toast]);

  const handleTeam1Change = (value: string) => {
    setTeam1Id(value);
    setTeam1(teams.find(t => t.id === value) || null);
    
    // Update URL params
    searchParams.set("team1", value);
    setSearchParams(searchParams);
    
    // Update head-to-head matches if both teams are selected
    if (team2) {
      const t1 = teams.find(t => t.id === value);
      if (t1) {
        const h2hMatches = getHeadToHeadMatches(t1.name, team2.name, matches);
        setHeadToHeadMatches(h2hMatches);
      }
    }
  };

  const handleTeam2Change = (value: string) => {
    setTeam2Id(value);
    setTeam2(teams.find(t => t.id === value) || null);
    
    // Update URL params
    searchParams.set("team2", value);
    setSearchParams(searchParams);
    
    // Update head-to-head matches if both teams are selected
    if (team1) {
      const t2 = teams.find(t => t.id === value);
      if (t2) {
        const h2hMatches = getHeadToHeadMatches(team1.name, t2.name, matches);
        setHeadToHeadMatches(h2hMatches);
      }
    }
  };

  // Prepare comparison data for charts
  const prepareComparisonData = () => {
    if (!team1 || !team2) return [];
    
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

  // Calculate head-to-head record
  const calculateH2HRecord = () => {
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

  const h2hRecord = calculateH2HRecord();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">Head-to-Head Comparison</h1>
          <p className="text-gray-600">Compare stats and results between two teams</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Team 1</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={team1Id || undefined} onValueChange={handleTeam1Change}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {team1 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold text-football-blue">{team1.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm">Position: {teams.findIndex(t => t.id === team1.id) + 1}</div>
                    <div className="text-sm">Points: {team1.points}</div>
                    <div className="text-sm">Form: 
                      <span className="ml-1">
                        {team1.form.map((result, i) => (
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
                  
                  {team1 && (
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link to={`/teams/${team1.id}`}>View Team Details</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Team 2</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={team2Id || undefined} onValueChange={handleTeam2Change}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {team2 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold text-football-blue">{team2.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm">Position: {teams.findIndex(t => t.id === team2.id) + 1}</div>
                    <div className="text-sm">Points: {team2.points}</div>
                    <div className="text-sm">Form: 
                      <span className="ml-1">
                        {team2.form.map((result, i) => (
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
                  
                  {team2 && (
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link to={`/teams/${team2.id}`}>View Team Details</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {team1 && team2 ? (
          <div className="space-y-6">
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
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowLeftRight className="h-5 w-5 mr-2 text-football-blue" />
                  Stat Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer 
                    config={{
                      team1: { label: team1.name, theme: { light: "#1e40af", dark: "#1e40af" } },
                      team2: { label: team2.name, theme: { light: "#0ea5e9", dark: "#0ea5e9" } }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareComparisonData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                        />
                        <Legend formatter={(value) => (value === 'team1' ? team1.name : team2.name)} />
                        <Bar dataKey="team1" fill="var(--color-team1)" name="team1" />
                        <Bar dataKey="team2" fill="var(--color-team2)" name="team2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Goal className="h-4 w-4 mr-2" />
                      Scoring Comparison
                    </h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-right py-2">{team1.name}</th>
                          <th className="text-right py-2">{team2.name}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Goals/Game</td>
                          <td className="text-right py-2">{(team1.goalsFor / team1.played).toFixed(2)}</td>
                          <td className="text-right py-2">{(team2.goalsFor / team2.played).toFixed(2)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Conceded/Game</td>
                          <td className="text-right py-2">{(team1.goalsAgainst / team1.played).toFixed(2)}</td>
                          <td className="text-right py-2">{(team2.goalsAgainst / team2.played).toFixed(2)}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Goal Difference</td>
                          <td className="text-right py-2">{team1.goalsFor - team1.goalsAgainst}</td>
                          <td className="text-right py-2">{team2.goalsFor - team2.goalsAgainst}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Comebacks</td>
                          <td className="text-right py-2">{team1.comebacks}</td>
                          <td className="text-right py-2">{team2.comebacks}</td>
                        </tr>
                        <tr>
                          <td className="py-2">HT Performance</td>
                          <td className="text-right py-2">
                            {team1.halfTimePerformance > 0 ? '+' : ''}
                            {team1.halfTimePerformance}
                          </td>
                          <td className="text-right py-2">
                            {team2.halfTimePerformance > 0 ? '+' : ''}
                            {team2.halfTimePerformance}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      Results Comparison
                    </h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-right py-2">{team1.name}</th>
                          <th className="text-right py-2">{team2.name}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Win %</td>
                          <td className="text-right py-2">
                            {((team1.won / team1.played) * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-2">
                            {((team2.won / team2.played) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Draw %</td>
                          <td className="text-right py-2">
                            {((team1.drawn / team1.played) * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-2">
                            {((team2.drawn / team2.played) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Loss %</td>
                          <td className="text-right py-2">
                            {((team1.lost / team1.played) * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-2">
                            {((team2.lost / team2.played) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Points/Game</td>
                          <td className="text-right py-2">
                            {(team1.points / team1.played).toFixed(2)}
                          </td>
                          <td className="text-right py-2">
                            {(team2.points / team2.played).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2">League Position</td>
                          <td className="text-right py-2">
                            {teams.findIndex(t => t.id === team1.id) + 1}
                          </td>
                          <td className="text-right py-2">
                            {teams.findIndex(t => t.id === team2.id) + 1}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Select two teams to see their head-to-head comparison.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default HeadToHead;
