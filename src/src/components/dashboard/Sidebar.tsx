
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package2,
  Map,
  Users,
  Settings,
  ChevronsLeft,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileAvatar from '@/components/profile/ProfileAvatar';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  userProfile?: any;
  userOrganization?: any;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: '/dashboard',
  },
  {
    title: 'Inventory',
    icon: <Package2 className="h-5 w-5" />,
    path: '/inventory',
  },
  {
    title: 'Map View',
    icon: <Map className="h-5 w-5" />,
    path: '/map',
  },
  {
    title: 'Users',
    icon: <Users className="h-5 w-5" />,
    path: '/users',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    path: '/settings',
  },
];

const Sidebar = ({ isOpen, toggleSidebar, userProfile, userOrganization }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    // Special case for map view to highlight when on /map route
    if (path === '/map' && location.pathname === '/map') {
      return true;
    }
    return location.pathname === path;
  };

  if (!isOpen && isMobile) {
    return null;
  }

  return (
    <aside
      className={cn(
        "bg-slate-800 border-r border-border h-screen fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-4 border-b border-slate-700 justify-between">
          {isOpen ? (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-red-500">
                <Globe className="h-4 w-4 text-red-500" />
              </div>
              <span className="font-semibold text-lg text-white">GeoInventory</span>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-red-500">
                <Globe className="h-4 w-4 text-red-500" />
              </div>
            </Link>
          )}
          
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-white hover:bg-slate-700"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronsLeft className={cn(
                "h-5 w-5 transition-transform",
                !isOpen && "rotate-180"
              )} />
            </Button>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center hover:bg-slate-700 px-3 py-2 rounded-md transition-colors",
                    isActive(item.path) 
                      ? "bg-slate-700 text-white font-medium" 
                      : "text-slate-300"
                  )}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <span className={cn("flex-shrink-0 text-white", !isOpen && "mx-auto")}>
                    {item.icon}
                  </span>
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                <ProfileAvatar 
                  fullName={userProfile?.full_name} 
                  email={userProfile?.email}
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-white">{userProfile?.full_name || 'User'}</p>
                <p className="text-xs text-sky-300 truncate">{userOrganization?.name || 'Organization'}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                <ProfileAvatar 
                  fullName={userProfile?.full_name} 
                  email={userProfile?.email}
                  size="sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
