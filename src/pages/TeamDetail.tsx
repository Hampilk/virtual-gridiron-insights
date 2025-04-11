
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchMatchData, generateLeagueTable, getTeamMatches, getTeamStatistics } from "@/services/dataService";
import { Match, Team, TeamStatistics } from "@/types";
import Layout from "@/components/Layout";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMatches, setTeamMatches] = useState<Match[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!teamId) return;
      
      try {
        setLoading(true);
        const matchData = await fetchMatchData();
        setMatches(matchData);
        
        if (matchData.length > 0) {
          const tableData = generateLeagueTable(matchData);
          const currentTeam = tableData.find(t => t.id === teamId);
          
          if (currentTeam) {
            setTeam(currentTeam);
            
            // Get team-specific matches
            const teamMatchesData = getTeamMatches(currentTeam.name, matchData);
            setTeamMatches(teamMatchesData);
            
            // Get detailed team statistics
            const stats = getTeamStatistics(currentTeam.name, matchData);
            setTeamStats(stats);
          } else {
            toast({
              title: "Error",
              description: "Team not found.",
              variant: "destructive"
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to load team data:", error);
        toast({
          title: "Error",
          description: "Failed to load team data. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadData();
  }, [teamId, toast]);

  if (!team || !teamStats) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-football-accent"></div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Team Not Found</h1>
              <Link to="/teams" className="text-football-accent hover:underline">
                Return to Teams
              </Link>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // Prepare data for result distribution chart
  const resultData = [
    { name: 'Wins', value: team.won, color: '#1a5d1a' },
    { name: 'Draws', value: team.drawn, color: '#fbbf24' },
    { name: 'Losses', value: team.lost, color: '#dc2626' }
  ];
  
  // Prepare data for half-time performance chart
  const halfTimeData = [
    { name: 'Leading', value: teamStats.halfTimeLeads, color: '#1a5d1a' },
    { name: 'Drawing', value: teamStats.halfTimeDraws, color: '#fbbf24' },
    { name: 'Trailing', value: teamStats.halfTimeDeficits, color: '#dc2626' }
  ];
  
  // Prepare data for goals comparison
  const goalsData = [
    { name: 'For', goals: team.goalsFor },
    { name: 'Against', goals: team.goalsAgainst }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">{team.name}</h1>
          <p className="text-gray-600">Team statistics and performance analysis</p>
        </div>
        
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-football-blue text-lg">Position</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-football-accent">
                {matches.length > 0 
                  ? generateLeagueTable(matches).findIndex(t => t.id === team.id) + 1 
                  : "-"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-football-blue text-lg">Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-football-accent">{team.points}</p>
              <p className="text-sm text-gray-500">
                PPG: {(team.points / team.played).toFixed(2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-football-blue text-lg">Form</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-1 justify-center">
                {team.form.map((result, i) => (
                  <span 
                    key={i} 
                    className={`inline-block w-8 h-8 text-sm flex items-center justify-center text-white font-bold rounded-full 
                      ${result === 'W' ? 'bg-green-600' : result === 'D' ? 'bg-amber-500' : 'bg-red-600'}`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-football-blue text-lg">Goal Difference</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-football-accent">
                {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
                {team.goalsFor - team.goalsAgainst}
              </p>
              <p className="text-sm text-gray-500">
                {team.goalsFor} scored, {team.goalsAgainst} conceded
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Stats Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Results Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resultData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {resultData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Goals Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={goalsData}>
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
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Team Stats Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stats-card">
                      <h3 className="stats-heading">Played</h3>
                      <p className="stats-value">{team.played}</p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Win Rate</h3>
                      <p className="stats-value">
                        {team.played > 0 ? ((team.won / team.played) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Clean Sheets</h3>
                      <p className="stats-value">{teamStats.cleanSheets}</p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Comebacks</h3>
                      <p className="stats-value">{teamStats.comebacks}</p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Goals/Game</h3>
                      <p className="stats-value">
                        {team.played > 0 ? (team.goalsFor / team.played).toFixed(2) : 0}
                      </p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Conceded/Game</h3>
                      <p className="stats-value">
                        {team.played > 0 ? (team.goalsAgainst / team.played).toFixed(2) : 0}
                      </p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Points from Losing</h3>
                      <p className="stats-value">{teamStats.pointsFromLosing}</p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Half-Time Performance</h3>
                      <p className="stats-value">
                        {team.halfTimePerformance > 0 ? '+' : ''}
                        {team.halfTimePerformance}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Recent Matches</CardTitle>
              </CardHeader>
              <CardContent>
                {teamMatches.length > 0 ? (
                  <div className="space-y-4">
                    {teamMatches.map(match => {
                      const isHome = match.homeTeam === team.name;
                      const teamScore = isHome ? match.homeFullTimeScore : match.awayFullTimeScore;
                      const opponentScore = isHome ? match.awayFullTimeScore : match.homeFullTimeScore;
                      const opponentName = isHome ? match.awayTeam : match.homeTeam;
                      
                      let resultClass = '';
                      if (teamScore > opponentScore) {
                        resultClass = 'team-win';
                      } else if (teamScore < opponentScore) {
                        resultClass = 'team-loss';
                      } else {
                        resultClass = 'team-draw';
                      }
                      
                      return (
                        <div 
                          key={match.id} 
                          className={`match-card ${resultClass}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="text-sm text-gray-500">
                                Matchday {match.matchday}
                              </div>
                              <div className="font-medium">
                                {isHome ? `vs ${opponentName} (H)` : `vs ${opponentName} (A)`}
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold">{teamScore}</span>
                                <span className="text-sm text-gray-500">-</span>
                                <span className="text-lg font-bold">{opponentScore}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                HT: {isHome ? match.homeHalfTimeScore : match.awayHalfTimeScore} - {isHome ? match.awayHalfTimeScore : match.homeHalfTimeScore}
                              </div>
                            </div>
                            
                            <div className="flex-1 text-right">
                              <div className="text-sm font-medium">
                                {teamScore > opponentScore 
                                  ? 'Win' 
                                  : teamScore === opponentScore 
                                    ? 'Draw' 
                                    : 'Loss'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No matches found for this team.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analysis Tab */}
          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Half-Time Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={halfTimeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {halfTimeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Second Half Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="stats-card">
                      <h3 className="stats-heading">Half-Time Performance Index</h3>
                      <p className="stats-value">
                        {team.halfTimePerformance > 0 ? '+' : ''}
                        {team.halfTimePerformance}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Points gained or lost from half-time to full-time
                      </p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Comebacks Completed</h3>
                      <p className="stats-value">{teamStats.comebacks}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Matches won after trailing at half-time
                      </p>
                    </div>
                    
                    <div className="stats-card">
                      <h3 className="stats-heading">Points from Losing Positions</h3>
                      <p className="stats-value">{teamStats.pointsFromLosing}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Points earned after trailing during a match
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <span className="font-bold text-football-blue">{team.name}</span> has played a total of {team.played} matches this season,
                      winning {team.won} ({team.played > 0 ? ((team.won / team.played) * 100).toFixed(1) : 0}%), 
                      drawing {team.drawn} and losing {team.lost}.
                    </p>
                    
                    <p className="text-gray-700">
                      They have scored {team.goalsFor} goals ({team.played > 0 ? (team.goalsFor / team.played).toFixed(2) : 0} per game)
                      and conceded {team.goalsAgainst} ({team.played > 0 ? (team.goalsAgainst / team.played).toFixed(2) : 0} per game).
                    </p>
                    
                    <p className="text-gray-700">
                      {team.name} has kept {teamStats.cleanSheets} clean sheets this season
                      ({team.played > 0 ? ((teamStats.cleanSheets / team.played) * 100).toFixed(1) : 0}% of matches).
                    </p>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-bold text-football-blue text-lg mb-2">Half-Time Analysis</h3>
                      
                      <p className="text-gray-700">
                        At half-time, they have been leading in {teamStats.halfTimeLeads} matches,
                        drawing in {teamStats.halfTimeDraws} and trailing in {teamStats.halfTimeDeficits}.
                      </p>
                      
                      <p className="text-gray-700 mt-2">
                        Their half-time performance index of {team.halfTimePerformance > 0 ? '+' : ''}{team.halfTimePerformance} indicates
                        they {team.halfTimePerformance > 0 
                          ? 'tend to improve in the second half' 
                          : team.halfTimePerformance < 0 
                            ? 'typically perform worse in the second half' 
                            : 'maintain consistent performance across both halves'}.
                      </p>
                      
                      <p className="text-gray-700 mt-2">
                        The team has completed {teamStats.comebacks} comebacks, winning after trailing at half-time,
                        and earned a total of {teamStats.pointsFromLosing} points from losing positions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TeamDetail;
