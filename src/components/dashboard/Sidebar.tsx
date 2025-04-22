
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Building, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Map
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserProfile as UserProfileType, Organization } from '@/services/profile/profileApi';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userProfile: UserProfileType | null;
  userOrganization: Organization | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, userProfile, userOrganization }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Team Members', path: '/users', icon: Users },
    { name: 'Organization', path: '/organization', icon: Building },
    { name: 'Profile', path: '/profile', icon: Settings },
  ];

  if (!isOpen && isMobile) {
    return null;
  }

  return (
    
    <aside
      className={cn(
        "flex flex-col bg-slate-800 border-r border-slate-700 fixed top-0 left-0 h-full z-50 transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex-1 flex flex-col h-full">
        <div className="h-16 flex items-center px-4 border-b border-slate-700 justify-between">
          {isOpen ? (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">GeoInventory</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
            </Link>
          )}
          
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="text-white hover:bg-slate-700 rounded-md p-1"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center hover:bg-blue-600/20 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-blue-500 text-white font-medium" 
                      : "text-slate-300"
                  )}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <span className={cn("flex-shrink-0", !isOpen && "mx-auto")}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={userProfile?.avatar_url || `https://avatar.vercel.sh/${user?.email}.png`} alt={userProfile?.full_name || 'Profile'} />
                <AvatarFallback className="bg-blue-600 text-white">{userProfile?.full_name?.substring(0, 2).toUpperCase() || 'UI'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{userProfile?.full_name || 'Unknown User'}</p>
                <p className="text-xs text-blue-300 truncate">{userOrganization?.name || 'My Organization'}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar>
                <AvatarImage src={userProfile?.avatar_url || `https://avatar.vercel.sh/${user?.email}.png`} alt={userProfile?.full_name || 'Profile'} />
                <AvatarFallback className="bg-blue-600 text-white">{userProfile?.full_name?.substring(0, 2).toUpperCase() || 'UI'}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
