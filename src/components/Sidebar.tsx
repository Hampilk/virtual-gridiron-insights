
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 transform md:relative md:translate-x-0 
                  md:w-64 z-20 bg-white shadow-lg transition-transform duration-300 ease-in-out
                  ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl text-football-blue">
            Navigation
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/" 
              className="block p-2 rounded hover:bg-football-accent hover:text-white transition-colors"
              onClick={onClose}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/standings" 
              className="block p-2 rounded hover:bg-football-accent hover:text-white transition-colors"
              onClick={onClose}
            >
              Standings
            </Link>
          </li>
          <li>
            <Link 
              to="/teams" 
              className="block p-2 rounded hover:bg-football-accent hover:text-white transition-colors"
              onClick={onClose}
            >
              Teams
            </Link>
          </li>
          <li>
            <Link 
              to="/matches" 
              className="block p-2 rounded hover:bg-football-accent hover:text-white transition-colors"
              onClick={onClose}
            >
              Matches
            </Link>
          </li>
          <li>
            <Link 
              to="/analysis" 
              className="block p-2 rounded hover:bg-football-accent hover:text-white transition-colors"
              onClick={onClose}
            >
              Analysis
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
