import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X, AlertTriangle, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProfileFormProps {
  userProfile: any;
  userOrganization: any;
  isEditing: boolean;
  isSaving: boolean;
  onSave: (data: { fullName: string; email: string }) => Promise<void>;
  onCancel: () => void;
}

const ProfileForm = ({
  userProfile,
  userOrganization,
  isEditing,
  isSaving,
  onSave,
  onCancel
}: ProfileFormProps) => {
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [email] = useState(userProfile?.email || '');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { deleteAccount } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ fullName, email });
  };

  const handleDeleteAccount = async () => {
    if (!userProfile) return;

    try {
      setDeleteLoading(true);
      await deleteAccount();
      toast.success("Your account and all data has been permanently deleted.", {
        duration: 6000,
        style: { fontSize: '1.1rem', fontWeight: 'bold', color: 'white', background: '#dc2626' },
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (!userProfile) {
    return (
      <Card className="border border-purple-500/10 shadow-lg">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Profile information not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-purple-500/10 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-purple-700">
          Profile Information
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-purple-800">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="border-purple-200 bg-purple-50/30 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email addresses cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-purple-800">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-purple-200" : "border-purple-200 bg-purple-50/30 cursor-not-allowed"}
            />
          </div>

          {userOrganization && (
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-purple-800">Organization</Label>
              <Input
                id="organizationName"
                value={userOrganization.name}
                disabled
                className="border-purple-200 bg-purple-50/30 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                To change your organization name, please contact support
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-gradient-to-r from-white to-purple-50/30 rounded-b-lg p-6 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            {isEditing ? (
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-purple-200"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : null}
          </div>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 mt-4 sm:mt-0 text-white"
                disabled={isSaving || deleteLoading}
              >
                {deleteLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-600 text-lg">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Delete your account? This cannot be undone!
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="bg-red-100 text-red-700 font-semibold border border-red-400 rounded p-3 mb-2">
                    <span className="font-bold">Warning:</span> 
                    Deleting your account is <span className="underline">irreversible</span>.<br />
                    <ul className="list-disc ml-5 mt-2 mb-1">
                      <li>Your account, organization, and all inventory data will be permanently deleted.</li>
                      <li>This cannot be undone or recovered later.</li>
                      <li><b>If you have an active subscription, please cancel it first. Subscription charges will not be automatically refunded.</b></li>
                    </ul>
                  </div>
                  Are you absolutely sure you want to delete your account?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
