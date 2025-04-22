
import { useState } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LoadingState } from '@/components/organization/LoadingState';
import OrganizationDetails from '@/components/organization/OrganizationDetails';
import SubscriptionPanel from '@/components/organization/SubscriptionPanel';
import { OrganizationProvider } from '@/contexts/OrganizationContext';

const Organization = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const { userProfile, userOrganization, isLoading } = useUserProfile();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <ProtectedRoute>
      <OrganizationProvider>
        <div className="min-h-screen bg-slate-900 flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            userProfile={userProfile}
            userOrganization={userOrganization}
          />
          
          <div 
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isSidebarOpen && !isMobile ? 'ml-64' : isMobile ? 'ml-0' : 'ml-[70px]'
            }`}
          >
            <Header 
              toggleSidebar={toggleSidebar} 
              isSidebarOpen={isSidebarOpen} 
              userProfile={userProfile}
              userOrganization={userOrganization}
            />
            
            <main className="flex-1 p-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-white">Organization</h1>
                </div>
                
                {isLoading ? (
                  <LoadingState />
                ) : (
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                      <OrganizationDetails 
                        userProfile={userProfile}
                        userOrganization={userOrganization}
                        formatDate={formatDate}
                      />
                    </div>
                    
                    <div className="md:col-span-1">
                      <SubscriptionPanel 
                        userProfile={userProfile}
                        userOrganization={userOrganization}
                        orgMembers={[]} // We're passing an empty array here, but ideally it should be fetched from context or a hook
                      />
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </OrganizationProvider>
    </ProtectedRoute>
  );
};

export default Organization;
