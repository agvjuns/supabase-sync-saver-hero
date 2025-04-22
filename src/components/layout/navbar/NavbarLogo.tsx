
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

interface NavbarLogoProps {
  onClick?: () => void;
}

export const NavbarLogo = ({ onClick }: NavbarLogoProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-red-500">
        <Globe className="h-6 w-6 text-red-500" />
      </div>
      <span className="font-semibold text-xl text-white">GeoInventory</span>
    </Link>
  );
};
