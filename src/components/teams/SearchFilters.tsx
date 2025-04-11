
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_SEASONS } from "@/services/constants";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSeason: string;
  handleSeasonChange: (value: string) => void;
  selectedTeams: string[];
  handleCompareClick: () => void;
}

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedSeason,
  handleSeasonChange,
  selectedTeams,
  handleCompareClick
}: SearchFiltersProps) => {
  return (
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
  );
};

export default SearchFilters;
