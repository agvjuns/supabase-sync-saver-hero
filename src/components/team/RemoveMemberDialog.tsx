
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertCircle, Loader2 } from 'lucide-react';

interface RemoveMemberDialogProps {
  memberToRemove: any;
  isRemoving: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmRemove: () => void;
}

export const RemoveMemberDialog = ({
  memberToRemove,
  isRemoving,
  onOpenChange,
  onConfirmRemove
}: RemoveMemberDialogProps) => {
  if (!memberToRemove) return null;

  return (
    <AlertDialog open={!!memberToRemove} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {memberToRemove.isPending ? "Cancel invitation" : "Remove team member"}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              {memberToRemove.isPending
                ? `Are you sure you want to cancel the invitation for ${memberToRemove.email}?`
                : `Are you sure you want to remove ${memberToRemove.full_name || memberToRemove.email} from this organization?`}
              {!memberToRemove.isPending && " They will lose access to all resources in this organization."}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirmRemove();
            }}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {memberToRemove.isPending ? "Cancelling..." : "Removing..."}
              </>
            ) : (
              memberToRemove.isPending ? "Cancel Invitation" : "Remove Member"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
