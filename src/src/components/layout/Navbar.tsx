
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { NavbarContainer } from './navbar/NavbarContainer';
import { NavbarLogo } from './navbar/NavbarLogo';
import { NavbarLinks } from './navbar/NavbarLinks';
import { NavbarUserMenu } from './navbar/NavbarUserMenu';
import { MobileMenu } from './navbar/MobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  const isLandingPage = location.pathname === '/';

  return (
    <NavbarContainer isScrolled={isScrolled}>
      <NavbarLogo onClick={closeMenu} />

      {isLandingPage ? (
        <>
          <NavbarLinks />

          <div className="hidden md:flex items-center space-x-4">
            <NavbarUserMenu 
              handleLogout={handleLogout} 
              setIsUserMenuOpen={setIsUserMenuOpen}
            />
          </div>

          <button 
            className="md:hidden text-white" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <MobileMenu 
            isOpen={isMenuOpen}
            isLandingPage={isLandingPage}
            closeMenu={closeMenu}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" onClick={handleLogout}>
            <button className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </Button>
        </div>
      )}
    </NavbarContainer>
  );
};

export default Navbar;
