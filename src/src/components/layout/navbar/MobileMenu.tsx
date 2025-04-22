
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NavbarLinks } from './NavbarLinks';

interface MobileMenuProps {
  isOpen: boolean;
  isLandingPage: boolean;
  closeMenu: () => void;
  handleLogout: () => Promise<void>;
}

export const MobileMenu = ({ isOpen, isLandingPage, closeMenu, handleLogout }: MobileMenuProps) => {
  const { user } = useAuth();
  
  if (!isOpen || !isLandingPage) {
    return null;
  }

  return (
    <div className="md:hidden absolute top-full left-0 right-0 glass-dark animate-fade-in p-4">
      <NavbarLinks isMobile closeMenu={closeMenu} />
      <div className="flex flex-col space-y-2 pt-4 border-t border-border">
        {user ? (
          <>
            <Link 
              to="/dashboard" 
              className="flex items-center px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-white"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Button 
              variant="ghost" 
              className="flex items-center justify-center text-red-500" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" className="justify-start text-white">
              <Link to="/login" onClick={closeMenu}>Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-primary">
              <Link to="/signup" onClick={closeMenu}>Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
