
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="bg-football-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="md:hidden text-white hover:bg-blue-800"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-football-accent">Virtual</span>&nbsp;Gridiron
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-football-accent transition-colors">Home</Link>
          <Link to="/standings" className="hover:text-football-accent transition-colors">Standings</Link>
          <Link to="/teams" className="hover:text-football-accent transition-colors">Teams</Link>
          <Link to="/matches" className="hover:text-football-accent transition-colors">Matches</Link>
          <Link to="/analysis" className="hover:text-football-accent transition-colors">Analysis</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
