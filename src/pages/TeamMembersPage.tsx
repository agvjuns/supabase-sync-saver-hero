
import { useState, useEffect } from 'react';
import { Users, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { InviteDialog } from '@/components/team/InviteDialog';

const TeamMembersPage = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userOrganization, setUserOrganization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          // Direct query instead of using RPC
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
              
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
              
              // Fetch org members
              const { data: membersData, error: membersError } = await supabase
                .from('profiles')
                .select('*')
                .eq('organization_id', orgId);
                
              if (membersError) throw membersError;
              setTeamMembers(membersData || []);
            }
          }
        } catch (error: any) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load team information');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);

  const handleInviteSent = async () => {
    if (user && userProfile?.organization_id) {
      try {
        // Refresh the team members list
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('organization_id', userProfile.organization_id);
          
        if (error) throw error;
        setTeamMembers(data || []);
        toast.success('Team member list updated');
      } catch (error) {
        console.error('Error refreshing team members:', error);
      }
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout 
        title="Team Members" 
        userProfile={userProfile}
        userOrganization={userOrganization}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-muted-foreground mt-1">Manage your team and their access</p>
            </div>
            <Button 
              onClick={() => setInviteDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </div>
          
          <Card className="bg-slate-800 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Organization Members
              </CardTitle>
              <CardDescription className="text-slate-400">
                Members with access to your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border border-slate-700">
                  <div className="relative w-full overflow-auto max-h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-700/50">
                          <TableHead className="font-medium text-slate-300">Name</TableHead>
                          <TableHead className="font-medium text-slate-300">Email</TableHead>
                          <TableHead className="font-medium text-slate-300">Role</TableHead>
                          <TableHead className="font-medium text-slate-300">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamMembers.length > 0 ? (
                          teamMembers.map((member) => (
                            <TableRow 
                              key={member.id} 
                              className="border-b border-slate-700 transition-colors hover:bg-slate-700/50"
                            >
                              <TableCell className="text-slate-200">{member.full_name || 'Not provided'}</TableCell>
                              <TableCell className="text-slate-200">{member.email}</TableCell>
                              <TableCell className="text-slate-200">
                                <span className="capitalize">{member.role || 'Member'}</span>
                              </TableCell>
                              <TableCell>
                                <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                                  member.status === 'active' 
                                    ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                                    : 'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                                }`}>
                                  {member.status || 'Active'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-slate-400">
                              No team members found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <InviteDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          onInviteSent={handleInviteSent}
          userOrganization={userOrganization}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default TeamMembersPage;
