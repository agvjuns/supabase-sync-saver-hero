
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { MemberTable } from '@/components/team/MemberTable';
import { RemoveMemberDialog } from '@/components/team/RemoveMemberDialog';

interface TeamMembersProps {
  userProfile: any;
  userOrganization: any;
  onInviteClick: () => void;
}

const TeamMembers = ({ userProfile, userOrganization, onInviteClick }: TeamMembersProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const { user } = useAuth();
  const isAdmin = userProfile?.role === 'admin';
  
  useEffect(() => {
    fetchOrganizationMembers();
  }, [userOrganization]);
  
  const fetchOrganizationMembers = async () => {
    if (!userOrganization?.id) return;
    
    try {
      setIsLoading(true);
      
      // Direct query instead of using RPC that might not exist yet
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', userOrganization.id);
        
      if (error) throw error;
      
      const { data: pendingData, error: pendingError } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', userOrganization.id)
        .is('user_id', null);
        
      if (pendingError) throw pendingError;
      
      const activeMembers = Array.isArray(data) ? data : [];
      const pendingInvites = Array.isArray(pendingData) ? pendingData.map(member => ({
        ...member,
        isPending: true
      })) : [];
      
      setMembers([...activeMembers, ...pendingInvites]);
      
    } catch (error: any) {
      console.error('Error fetching organization members:', error);
      toast.error('Failed to load team members: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    
    try {
      setIsRemoving(true);
      
      if (memberToRemove.isPending) {
        const { error } = await supabase
          .from('organization_members')
          .delete()
          .eq('id', memberToRemove.id);
          
        if (error) throw error;
      } else {
        if (memberToRemove.id === user?.id) {
          toast.error("You cannot remove yourself from the organization");
          return;
        }
        
        const { error: memberError } = await supabase
          .from('organization_members')
          .delete()
          .eq('user_id', memberToRemove.id)
          .eq('organization_id', userOrganization.id);
          
        if (memberError) throw memberError;
      }
      
      toast.success(memberToRemove.isPending 
        ? 'Invitation cancelled successfully' 
        : 'Team member removed successfully'
      );
      
      fetchOrganizationMembers();
      
    } catch (error: any) {
      console.error('Error removing team member:', error);
      toast.error(`Failed to remove team member: ${error.message}`);
    } finally {
      setIsRemoving(false);
      setMemberToRemove(null);
    }
  };
  
  return (
    <>
      <Card className="bg-slate-800 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Team Members
            </CardTitle>
            <CardDescription>
              People with access to your organization
            </CardDescription>
          </div>
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onInviteClick}
              className="text-white border-slate-600 hover:bg-slate-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            </div>
          ) : (
            <MemberTable 
              members={members}
              isAdmin={isAdmin}
              onRemoveMember={setMemberToRemove}
            />
          )}
        </CardContent>
      </Card>
      
      <RemoveMemberDialog
        memberToRemove={memberToRemove}
        isRemoving={isRemoving}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        onConfirmRemove={handleRemoveMember}
      />
    </>
  );
};

export default TeamMembers;
