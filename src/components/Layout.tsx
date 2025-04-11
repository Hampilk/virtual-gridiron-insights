
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {location.pathname !== "/head-to-head" && (
            <div className="absolute top-16 right-4 md:right-6 z-10">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-white hover:bg-gray-100"
              >
                <Link to="/head-to-head" className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Team Comparison
                </Link>
              </Button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
