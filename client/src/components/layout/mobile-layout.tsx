import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import BottomNavigation from "./bottom-navigation";
import ProfileHeader from "./profile-header";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { toast } = useToast();
  const [location] = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pages that should use the ProfileHeader instead of the default global header
  const useProfileHeader = true; // Use ProfileHeader for all pages for consistency

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    toast({
      title: isDarkMode ? "Light mode enabled" : "Dark mode enabled",
      description: "Theme preference saved",
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: "Search Results",
        description: `Searching for "${searchQuery}" across your health data...`,
      });
    }
    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <div className="h-svh flex flex-col bg-gray-50 w-full relative dark:bg-gray-900">
      {useProfileHeader ? (
        <ProfileHeader />
      ) : (
        /* Global Header */
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HolistiCare</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)}>
                <Search className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "No new notifications",
                  });
                }}
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>
      )}

      <div className="flex-1 overflow-y-auto">
        {useProfileHeader ? (
          children
        ) : (
          <main className="p-4">
            {children}
          </main>
        )}
      </div>

      {/* Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Search Health Data</DialogTitle>
            <DialogDescription>
              Search across lab results, plans, and health insights
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search biomarkers, plans, insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                Search
              </Button>
              <Button variant="outline" onClick={() => setShowSearch(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}
