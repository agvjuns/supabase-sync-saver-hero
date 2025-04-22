
import { ReactNode } from 'react';

interface NavbarContainerProps {
  isScrolled: boolean;
  children: ReactNode;
}

export const NavbarContainer = ({ isScrolled, children }: NavbarContainerProps) => {
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container flex items-center justify-between">
        {children}
      </div>
    </header>
  );
};
