
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Goal, Trophy } from "lucide-react";
import { Team } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

interface StatComparisonProps {
  team1: Team;
  team2: Team;
  teams: Team[];
  comparisonData: Array<{
    name: string;
    team1: number;
    team2: number;
  }>;
}

const StatComparison = ({ team1, team2, teams, comparisonData }: StatComparisonProps) => {
  return (
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
                data={comparisonData}
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
  );
};

export default StatComparison;
