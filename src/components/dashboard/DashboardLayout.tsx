
import { ReactNode, useState } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userProfile?: any;
  userOrganization?: any;
  hideSearchInput?: boolean;
}

const DashboardLayout = ({ 
  children, 
  title, 
  userProfile, 
  userOrganization,
  hideSearchInput = false 
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        userProfile={userProfile}
        userOrganization={userOrganization}
      />
      
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ 
          marginLeft: isSidebarOpen && !isMobile ? '16rem' : isMobile ? '0' : '4.375rem',
        }}
      >
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          userProfile={userProfile}
          userOrganization={userOrganization}
          hideSearchInput={hideSearchInput}
        />
        
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
