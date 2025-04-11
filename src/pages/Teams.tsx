
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchMatchData, generateLeagueTable } from "@/services/dataService";
import { Match, Team } from "@/types";
import Layout from "@/components/Layout";
import TeamsList from "@/components/teams/TeamsList";
import SearchFilters from "@/components/teams/SearchFilters";
import TeamHeader from "@/components/teams/TeamHeader";

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
        <TeamHeader 
          title="Teams" 
          description="Explore all teams in the championship" 
        />
        
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSeason={selectedSeason}
          handleSeasonChange={handleSeasonChange}
          selectedTeams={selectedTeams}
          handleCompareClick={handleCompareClick}
        />
        
        <TeamsList 
          teams={teams}
          filteredTeams={filteredTeams}
          selectedTeams={selectedTeams}
          loading={loading}
          selectedSeason={selectedSeason}
          handleTeamSelect={handleTeamSelect}
        />
      </div>
    </Layout>
  );
};

export default Teams;
