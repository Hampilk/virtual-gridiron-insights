
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchMatchData, generateLeagueTable, getHeadToHeadMatches } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";
import TeamSelector from "@/components/headToHead/TeamSelector";
import HeadToHeadRecord from "@/components/headToHead/HeadToHeadRecord";
import StatComparison from "@/components/headToHead/StatComparison";
import EmptyState from "@/components/headToHead/EmptyState";
import { calculateH2HRecord, prepareComparisonData } from "@/components/headToHead/utils";

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

  const h2hRecord = calculateH2HRecord(team1, team2, headToHeadMatches);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-football-blue">Head-to-Head Comparison</h1>
          <p className="text-gray-600">Compare stats and results between two teams</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TeamSelector 
            teamNumber={1}
            selectedTeamId={team1Id}
            onTeamChange={handleTeam1Change}
            teams={teams}
            selectedTeam={team1}
          />
          
          <TeamSelector 
            teamNumber={2}
            selectedTeamId={team2Id}
            onTeamChange={handleTeam2Change}
            teams={teams}
            selectedTeam={team2}
          />
        </div>
        
        {team1 && team2 ? (
          <div className="space-y-6">
            <HeadToHeadRecord 
              team1={team1}
              team2={team2}
              headToHeadMatches={headToHeadMatches}
              h2hRecord={h2hRecord}
            />
            
            <StatComparison 
              team1={team1}
              team2={team2}
              teams={teams}
              comparisonData={prepareComparisonData(team1, team2)}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </Layout>
  );
};

export default HeadToHead;
