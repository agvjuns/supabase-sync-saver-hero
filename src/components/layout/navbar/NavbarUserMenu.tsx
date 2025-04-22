
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, ChevronDown, Settings, Gauge, Package2, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { navButtonStyles, buttonEffects } from './buttonStyles';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavbarUserMenuProps {
  handleLogout: () => Promise<void>;
  setIsUserMenuOpen?: (value: boolean) => void;
}

export const NavbarUserMenu = ({ handleLogout, setIsUserMenuOpen }: NavbarUserMenuProps) => {
  const [isUserMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleUserMenu = () => {
    const newState = !isUserMenuOpen;
    setIsMenuOpen(newState);
    setIsUserMenuOpen?.(newState);
  };

  const closeUserMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen?.(false);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" className={cn(navButtonStyles({ variant: "outline" }))}>
          <Link to="/login">Log in</Link>
        </Button>
        <Button asChild className={cn(navButtonStyles({ variant: "primary" }), buttonEffects.glow)}>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <Popover open={isUserMenuOpen} onOpenChange={toggleUserMenu}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(navButtonStyles({ variant: "ghost" }), "flex items-center")}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <User className="h-5 w-5 text-white" />
          </div>
          <span className="text-white">My Account</span>
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-56 border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg"
        align="end"
      >
        <div className="p-3 border-b border-slate-100">
          <p className="font-medium">{user.email}</p>
          <p className="text-sm text-slate-500 mt-0.5 truncate">Account settings and preferences</p>
        </div>
        <div className="py-2">
          <Link 
            to="/dashboard" 
            className="flex items-center px-3 py-2 text-sm hover:bg-slate-100 transition-colors" 
            onClick={closeUserMenu}
          >
            <Gauge className="h-4 w-4 mr-2 text-slate-500" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/inventory" 
            className="flex items-center px-3 py-2 text-sm hover:bg-slate-100 transition-colors" 
            onClick={closeUserMenu}
          >
            <Package2 className="h-4 w-4 mr-2 text-slate-500" />
            <span>Inventory</span>
          </Link>
          <Link 
            to="/profile" 
            className="flex items-center px-3 py-2 text-sm hover:bg-slate-100 transition-colors" 
            onClick={closeUserMenu}
          >
            <UserCircle className="h-4 w-4 mr-2 text-slate-500" />
            <span>Profile</span>
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm border-t border-slate-100 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Sign out</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};
