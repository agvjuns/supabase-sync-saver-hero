
import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, User, Building, Shield } from "lucide-react";

interface ProfileFormProps {
  userProfile: any;
  userOrganization: any;
  isEditing: boolean;
  isSaving: boolean;
  onSave: (formData: { fullName: string; email: string }) => Promise<void>;
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
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  // Update form data when userProfile changes or editing state changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.full_name || '',
        email: userProfile.email || ''
      });
    }
  }, [userProfile, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    await onSave(formData);
  };

  if (!userProfile) {
    return (
      <Card className="bg-card border border-purple-500/10 shadow-lg hover:shadow-xl transition-shadow h-full flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-muted-foreground">No profile information available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-purple-500/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-purple-700 flex items-center">
          <User className="h-5 w-5 mr-2 text-purple-600" />
          Profile Information
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update your personal information" : "Your profile information"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-purple-700">Full Name</Label>
          <Input 
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
            className="bg-background/50 focus:border-purple-400"
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-purple-700">Email</Label>
          <Input 
            id="email"
            name="email"
            value={formData.email}
            disabled={true} // Email cannot be changed
            className="bg-background/50"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed. Contact support for assistance.
          </p>
        </div>
        
        <div className="pt-2 space-y-2">
          <Label className="text-purple-700">Organization</Label>
          <div className="flex items-center border rounded-md p-3 bg-background/50 border-purple-500/10">
            <Building className="h-4 w-4 mr-2 text-purple-500" />
            <span>{userOrganization?.name || 'Not assigned'}</span>
          </div>
        </div>
        
        <div className="pt-2 space-y-2">
          <Label className="text-purple-700">Role</Label>
          <div className="flex items-center border rounded-md p-3 bg-background/50 border-purple-500/10">
            <Shield className="h-4 w-4 mr-2 text-purple-500" />
            <span>{userProfile?.role || 'Member'}</span>
          </div>
        </div>
      </CardContent>
      
      {isEditing && (
        <CardFooter className="border-t border-purple-500/10 pt-4 flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSaving}
            className="border-purple-300 hover:bg-purple-100 text-purple-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
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
  );
};

export default ProfileForm;
