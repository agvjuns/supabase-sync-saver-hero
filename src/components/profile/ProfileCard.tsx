
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Mail, Building } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import { useProfilePicture } from "@/hooks/useProfilePicture";
import { UserProfile } from "@/services/profile/profileApi";

interface ProfileCardProps {
  userProfile: UserProfile | null;
  userOrganization: any;
  onEdit: () => void;
  isEditing: boolean;
}

const ProfileCard = ({ userProfile, userOrganization, onEdit, isEditing }: ProfileCardProps) => {
  const { uploadAvatar, isUploading } = useProfilePicture();
  
  const handleUpload = async (file: File) => {
    if (!userProfile) return null;
    return await uploadAvatar(file);
  };
  
  if (!userProfile) {
    return (
      <Card className="bg-card border border-purple-500/10 shadow-lg hover:shadow-xl transition-shadow h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Profile information not available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card border border-purple-500/10 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-purple-50 rounded-t-lg">
        <div className="flex justify-center mb-4">
          <ProfileAvatar 
            fullName={userProfile.full_name} 
            email={userProfile.email}
            avatarUrl={userProfile.avatar_url}
            size="lg"
            uploadable={!isEditing}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        </div>
        <CardTitle className="text-xl font-semibold text-purple-700">
          {userProfile.full_name || 'User'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {userProfile.role || 'Member'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="text-center pt-6">
        <div className="flex items-center justify-center mb-2 text-sm">
          <Mail className="h-4 w-4 mr-2 text-purple-500" />
          <span className="text-muted-foreground">{userProfile.email}</span>
        </div>
        {userOrganization && (
          <div className="flex items-center justify-center text-sm">
            <Building className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-muted-foreground">{userOrganization.name}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-purple-500/10 pt-4">
        <Button 
          variant="outline" 
          className="w-full border-purple-500/20 hover:bg-purple-500/5 text-purple-600 font-medium"
          onClick={onEdit}
          disabled={isEditing}
        >
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
