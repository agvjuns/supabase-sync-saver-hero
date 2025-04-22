
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MemberTableProps {
  members: any[];
  isAdmin: boolean;
  onRemoveMember: (member: any) => void;
}

export const MemberTable = ({ members, isAdmin, onRemoveMember }: MemberTableProps) => {
  const { user } = useAuth();

  return (
    <div className="rounded-md overflow-hidden border border-slate-700">
      <Table>
        <TableHeader className="bg-slate-700">
          <TableRow className="hover:bg-slate-700">
            <TableHead className="text-white">Name/Email</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Role</TableHead>
            {isAdmin && <TableHead className="text-white w-20">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member.id} className="hover:bg-slate-700">
                <TableCell className="text-slate-300">
                  {member.isPending 
                    ? member.email 
                    : (member.full_name || member.email || 'Unknown')}
                </TableCell>
                <TableCell className="text-slate-300">
                  {member.isPending ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Pending
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-slate-300">
                  <span className="capitalize">{member.role || 'Member'}</span>
                  {!member.isPending && member.id === user?.id && (
                    <span className="ml-2 text-xs text-blue-400">(You)</span>
                  )}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {(!member.isPending || member.id !== user?.id) && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onRemoveMember(member)}
                        className="text-red-400 hover:text-red-500 hover:bg-slate-700/50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isAdmin ? 4 : 3} className="text-center text-slate-400">
                No team members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
