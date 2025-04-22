
import { Link } from 'react-router-dom';

interface NavbarLinksProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

export const NavbarLinks = ({ isMobile = false, closeMenu }: NavbarLinksProps) => {
  const baseClassName = "text-white hover:text-primary transition-colors";
  const mobileClassName = `${baseClassName} px-4 py-2 rounded-md hover:bg-primary/5`;
  
  return (
    <nav className={isMobile ? "flex flex-col space-y-4 py-4" : "hidden md:flex items-center space-x-8"}>
      <Link 
        to="/#features" 
        className={isMobile ? mobileClassName : baseClassName}
        onClick={closeMenu}
      >
        Features
      </Link>
      <Link 
        to="/#pricing" 
        className={isMobile ? mobileClassName : baseClassName}
        onClick={closeMenu}
      >
        Pricing
      </Link>
      <Link 
        to="/#contact" 
        className={isMobile ? mobileClassName : baseClassName}
        onClick={closeMenu}
      >
        Contact
      </Link>
    </nav>
  );
};
