import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  Settings, 
  HelpCircle, 
  User,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  userProfile?: any;
  userOrganization?: any;
  hideSearchInput?: boolean;
}

const Header = ({ 
  toggleSidebar, 
  isSidebarOpen, 
  userProfile, 
  userOrganization,
  hideSearchInput = false 
}: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchFocused, setSearchFocused] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      // The redirect is handled in the signOut function
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen && isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        {!isMobile && !hideSearchInput && (
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
              searchFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <Input
              placeholder="Search..."
              className={`w-[200px] lg:w-[280px] pl-9 h-9 transition-all ${
                searchFocused ? 'ring-1 ring-ring' : ''
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {isMobile && !hideSearchInput && (
          <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
        )}
        
        <Button variant="ghost" size="icon" className="text-muted-foreground relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8 bg-muted"
              aria-label="User menu"
            >
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt={userProfile?.full_name || "User"} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {userProfile?.full_name || "My Account"}
              {userOrganization && (
                <p className="text-xs text-muted-foreground mt-1">
                  {userOrganization.name}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/help" className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
