
import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Building, 
  Users, 
  Calendar, 
  BookOpen, 
  Edit
} from 'lucide-react';

const Organization = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userOrganization, setUserOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subscriptionTier: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [orgMembers, setOrgMembers] = useState<any[]>([]);
  
  const isMobile = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Direct query to profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
              
          if (profileError) throw profileError;
          
          if (profileData) {
            setUserProfile(profileData);
            
            // If we have the organization id from the profile, fetch the organization details
            if (profileData.organization_id) {
              const orgId = profileData.organization_id;
              
              const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', orgId)
                .single();
                
              if (orgError) throw orgError;
              setUserOrganization(orgData);
              setFormData({
                name: orgData.name || '',
                subscriptionTier: orgData.subscription_tier || 'free'
              });
              
              // Fetch org members
              const { data: membersData, error: membersError } = await supabase
                .from('profiles')
                .select('*')
                .eq('organization_id', orgId);
                
              if (membersError) throw membersError;
              setOrgMembers(membersData || []);
            }
          }
        } catch (error: any) {
          console.error('Error fetching organization data:', error);
          toast.error('Failed to load organization information');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchOrganizationData();
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userOrganization) return;
    
    try {
      setIsSaving(true);
      
      // Check if user is an admin
      if (userProfile.role !== 'admin') {
        toast.error('Only organization admins can update organization details');
        return;
      }
      
      // Update the organization in Supabase
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name
        })
        .eq('id', userOrganization.id);
        
      if (error) throw error;
      
      // Update local state
      setUserOrganization(prev => ({
        ...prev,
        name: formData.name
      }));
      
      setIsEditing(false);
      toast.success('Organization updated successfully');
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userOrganization) {
      setFormData({
        name: userOrganization.name || '',
        subscriptionTier: userOrganization.subscription_tier || 'free'
      });
    }
    setIsEditing(false);
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
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-primary">Organization</h1>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-6">
                    <Card className="bg-card border border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-semibold text-primary flex items-center">
                            <Building className="h-5 w-5 mr-2 text-primary" />
                            Organization Details
                          </CardTitle>
                          <CardDescription>
                            Manage your organization information
                          </CardDescription>
                        </div>
                        {userProfile?.role === 'admin' && !isEditing && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleEdit}
                            className="h-8 w-8 border-primary/20 hover:bg-primary/5"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Organization Name</Label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing || isSaving}
                            className="bg-background/50"
                          />
                        </div>
                        
                        <div className="pt-2 space-y-2">
                          <Label>Subscription Tier</Label>
                          <div className="flex items-center border rounded-md p-3 bg-background/50">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="capitalize">{userOrganization?.subscription_tier || 'Free'}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 space-y-2">
                          <Label>Created On</Label>
                          <div className="flex items-center border rounded-md p-3 bg-background/50">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{userOrganization?.created_at ? formatDate(userOrganization.created_at) : 'Unknown'}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      {isEditing && (
                        <CardFooter className="border-t border-primary/10 pt-4 flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                          <Button  
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : 'Save Changes'}
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                    
                    <Card className="bg-card border border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-primary flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          Organization Members
                        </CardTitle>
                        <CardDescription>
                          Members with access to your organization
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-hidden rounded-md border border-primary/10">
                          {orgMembers.length > 0 ? (
                            <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b bg-muted/50">
                                  <tr className="border-b border-primary/10 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                  </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                  {orgMembers.map((member, index) => (
                                    <tr 
                                      key={index} 
                                      className="border-b border-primary/5 transition-colors hover:bg-muted/50"
                                    >
                                      <td className="p-4 align-middle">{member.full_name || 'Unknown'}</td>
                                      <td className="p-4 align-middle">{member.email}</td>
                                      <td className="p-4 align-middle">
                                        <span className="capitalize">{member.role || 'Member'}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center h-24 text-muted-foreground">
                              No members found
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="md:col-span-1">
                    <Card className="bg-card border border-primary/10 shadow-lg hover:shadow-xl transition-shadow sticky top-6">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-primary flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-primary" />
                          Subscription
                        </CardTitle>
                        <CardDescription>
                          Manage your plan and billing
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center mb-4">
                          <div className="text-2xl font-bold text-primary mb-1 capitalize">
                            {userOrganization?.subscription_tier || 'Free'} Plan
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Current active subscription
                          </p>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            Upgrade Plan
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Team Members</span>
                            <span className="text-sm">
                              {orgMembers.length} / {userOrganization?.subscription_tier === 'free' ? '3' : 'Unlimited'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Storage</span>
                            <span className="text-sm">
                              {userOrganization?.subscription_tier === 'free' ? '5 GB' : 'Unlimited'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Support</span>
                            <span className="text-sm">
                              {userOrganization?.subscription_tier === 'free' ? 'Email' : 'Priority'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-primary/10 pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full border-primary/20 hover:bg-primary/5"
                        >
                          Manage Billing
                        </Button>
                      </CardFooter>
                    </Card>
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

export default Organization;
