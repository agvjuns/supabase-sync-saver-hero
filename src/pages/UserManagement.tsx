
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, Loader2, Shield, User, UserCog, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { userProfile, userOrganization } = useUserProfile();
  const { session } = useAuth();

  const isAdmin = userProfile?.role === 'admin';

  // Fetch users from the organization
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      if (!session) return;
      
      const { data, error } = await supabase.functions.invoke('manage-roles', {
        method: 'GET'
      });

      if (error) throw error;
      
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Change a user's role
  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      if (!session) return;
      
      setUpdating(userId);
      
      const { data, error } = await supabase.functions.invoke('manage-roles', {
        method: 'POST',
        body: { userId, role: newRole }
      });

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success(data.message || 'Role updated successfully');
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role: ' + (error.message || 'Unknown error'));
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  if (!isAdmin) {
    return (
      <DashboardLayout
        title="User Management"
        userProfile={userProfile}
        userOrganization={userOrganization}
      >
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Only administrators can manage users.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="User Management"
      userProfile={userProfile}
      userOrganization={userOrganization}
    >
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-slate-600" />
              <CardTitle className="text-xl">Organization Members</CardTitle>
            </div>
            <CardDescription>
              Manage roles for members in your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-slate-600">Loading users...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[150px]">Role</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                          No users found in your organization
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2">
                                {user.role === 'admin' ? (
                                  <Shield className="h-4 w-4 text-primary" />
                                ) : (
                                  <User className="h-4 w-4 text-slate-600" />
                                )}
                              </div>
                              <span>{user.full_name || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {user.role === 'admin' ? (
                                <Shield className="h-4 w-4 mr-1 text-primary" />
                              ) : (
                                <User className="h-4 w-4 mr-1 text-slate-600" />
                              )}
                              <span className="capitalize">{user.role || 'user'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.id === userProfile?.id ? (
                              <span className="text-xs text-slate-500">Current user</span>
                            ) : (
                              <Select
                                value={user.role}
                                onValueChange={(value) => changeUserRole(user.id, value)}
                                disabled={updating === user.id}
                              >
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center">
              <UserCog className="h-5 w-5 mr-2 text-slate-600" />
              <CardTitle className="text-xl">Role Permissions</CardTitle>
            </div>
            <CardDescription>
              Understanding role permissions in your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="font-semibold text-blue-700">Admin Role</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-blue-700 ml-7 space-y-1">
                  <li>Manage organization settings</li>
                  <li>View all inventory items</li>
                  <li>Assign and change user roles</li>
                  <li>Invite new members to the organization</li>
                  <li>Manage billing and subscription</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 mr-2 text-slate-600" />
                  <h3 className="font-semibold text-slate-700">User Role</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-slate-600 ml-7 space-y-1">
                  <li>View inventory items</li>
                  <li>Add and edit inventory items</li>
                  <li>View organization members</li>
                  <li>Update personal profile</li>
                  <li>Cannot change roles or invite members</li>
                </ul>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Every organization must have at least one admin. You cannot remove admin role from yourself if you're the only admin.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
