
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from 'lucide-react';

interface ProfileAvatarProps {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  uploadable?: boolean;
  onUpload?: (file: File) => Promise<string | null>;
  isUploading?: boolean;
}

const ProfileAvatar = ({ 
  fullName, 
  email, 
  avatarUrl, 
  size = "md",
  uploadable = false,
  onUpload,
  isUploading = false
}: ProfileAvatarProps) => {
  const [hovered, setHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const fallbackText = fullName?.charAt(0) || email?.charAt(0) || 'U';
  
  useEffect(() => {
    // Reset error state when avatarUrl changes
    if (avatarUrl) {
      setImageError(false);
      // Add resize parameters to the image URL if it's from a cloud storage provider
      if (avatarUrl.includes('supabase.co')) {
        // Add width parameter based on size
        const width = size === 'sm' ? 40 : size === 'md' ? 64 : 96;
        const resizeParams = `?width=${width}&height=${width}&resize=fill`;
        setImageSrc(`${avatarUrl}${resizeParams}`);
      } else {
        setImageSrc(avatarUrl);
      }
    } else {
      setImageSrc(null);
    }
  }, [avatarUrl, size]);
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24 border-4 border-purple-500/20"
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpload || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    await onUpload(file);
  };
  
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Avatar className={`${sizeClasses[size]} bg-purple-100 overflow-hidden`}>
        {!imageError && imageSrc ? (
          <AvatarImage 
            src={imageSrc} 
            alt={fullName || "User avatar"} 
            className="object-contain w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white text-2xl font-bold">
          {fallbackText}
        </AvatarFallback>
      </Avatar>
      
      {uploadable && (
        <>
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <label
            htmlFor="avatar-upload"
            className={`absolute inset-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${
              hovered ? 'bg-black/40' : 'bg-transparent'
            }`}
          >
            {hovered && (
              <div className="text-white flex flex-col items-center justify-center">
                {isUploading ? (
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mb-1" />
                    <span className="text-xs">Upload</span>
                  </>
                )}
              </div>
            )}
          </label>
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
