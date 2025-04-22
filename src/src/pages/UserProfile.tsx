
import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, AlertCircle } from 'lucide-react';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const isMobile = useIsMobile();
  const { 
    userProfile, 
    userOrganization, 
    isLoading, 
    isSaving, 
    updateUserProfile 
  } = useUserProfile();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (formData: { fullName: string; email: string }) => {
    try {
      const success = await updateUserProfile({ fullName: formData.fullName });
      if (success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex">
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
            hideSearchInput={true}
          />
          
          <main className="flex-1 p-6 bg-gradient-to-br from-purple-50/30 to-white/80">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-purple-700">User Profile</h1>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64 bg-white/50 rounded-lg shadow-sm">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-3" />
                    <p className="text-purple-700">Loading profile data...</p>
                  </div>
                </div>
              ) : !userProfile ? (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    We couldn't load your profile information. Please try refreshing the page or contact support if the issue persists.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <ProfileCard
                      userProfile={userProfile}
                      userOrganization={userOrganization}
                      onEdit={handleEdit}
                      isEditing={isEditing}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <ProfileForm
                      userProfile={userProfile}
                      userOrganization={userOrganization}
                      isEditing={isEditing}
                      isSaving={isSaving}
                      onSave={handleSave}
                      onCancel={handleCancel}
                    />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
