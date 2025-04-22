
import { useState } from 'react';
import { X, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { inviteTeamMember } from '@/services/subscription/subscriptionService';
import { toast } from 'sonner';

type InviteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSent?: () => void;
  userOrganization: { id: string; name: string } | null;
};

export function InviteDialog({ open, onOpenChange, onInviteSent, userOrganization }: InviteDialogProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter the user\'s name');
      return;
    }
    if (!userOrganization) {
      toast.error('No organization found for this invite');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Pass the organization ID as the last parameter
      const result = await inviteTeamMember(email, role, name, userOrganization.id);
      if (result.success) {
        toast.success(result.message);
        if (onInviteSent) onInviteSent();
        onOpenChange(false);
        setEmail('');
        setName('');
        setRole('user');
      } else {
        setErrorMessage(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to invite team member';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setRole('user');
    setErrorMessage(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          sm:max-w-[425px]
          bg-white
          rounded-xl
          shadow-lg
          py-8
          px-6
          relative
          flex
          flex-col
          items-center
          justify-center
        "
        style={{
          // Fallback centering for custom DialogContent
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          zIndex: 50,
        }}
      >
        <DialogHeader className="w-full">
          <DialogTitle className="text-2xl font-bold text-gray-900">Invite Team Member</DialogTitle>
          <DialogDescription className="text-gray-600">
            Send an invitation to join your organization.
          </DialogDescription>
        </DialogHeader>

        <DialogClose className="absolute right-4 top-4 rounded-full opacity-70 hover:opacity-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
          <X className="h-5 w-5 text-gray-500" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <form onSubmit={handleSubmit} className="w-full mt-4">
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 text-sm p-3 rounded-md mb-4 border border-red-200">
              <XCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}
          <div className="grid gap-6 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 bg-white"
                placeholder="Full name"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 bg-white"
                placeholder="teammate@example.com"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="organization" className="text-right text-gray-700">
                Organization
              </Label>
              <Input
                id="organization"
                type="text"
                value={userOrganization ? userOrganization.name : ''}
                readOnly
                className="col-span-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right text-gray-700">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={isSubmitting}
              >
                <SelectTrigger id="role" className="col-span-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-gray-900">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin" disabled>
                    Admin (only one admin per org)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-t border-gray-200 my-4" />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Invite...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
