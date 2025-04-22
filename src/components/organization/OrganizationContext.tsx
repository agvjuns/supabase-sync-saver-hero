import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface OrganizationFormData {
  name: string;
  billingEmail: string;
}

interface OrganizationContextProps {
  formData: OrganizationFormData;
  isEditing: boolean;
  isSaving: boolean;
  setIsEditing: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

export const OrganizationContext = createContext<OrganizationContextProps | undefined>(undefined);

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
  userProfile: any;
  userOrganization: any;
}

export const OrganizationProvider = ({
  children,
  userProfile,
  userOrganization,
}: OrganizationProviderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    billingEmail: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (userOrganization) {
      setFormData({
        name: userOrganization.name || '',
        billingEmail: userOrganization.billing_email || ''
      });
    }
  }, [userOrganization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userOrganization || !user || !userProfile) return;
    
    try {
      setIsSaving(true);
      
      // Check if user is an admin
      if (userProfile.role !== 'admin') {
        toast.error('Only organization admins can update organization details');
        return;
      }
      
      console.log('Updating organization:', {
        p_org_id: userOrganization.id,
        p_user_id: user.id,
        p_new_name: formData.name,
        p_billing_email: formData.billingEmail
      });
      
      // Since the function doesn't exist yet, let's use a direct update for now
      const { data, error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          billing_email: formData.billingEmail
        })
        .eq('id', userOrganization.id);
      
      if (error) {
        console.error('Error updating organization:', error);
        throw error;
      }
      
      setIsEditing(false);
      toast.success('Organization updated successfully');
      
      // Force reload to update the UI with new values
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error(`Failed to update organization: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userOrganization) {
      setFormData({
        name: userOrganization.name || '',
        billingEmail: userOrganization.billing_email || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <OrganizationContext.Provider
      value={{
        formData,
        isEditing,
        isSaving,
        setIsEditing,
        handleInputChange,
        handleSave,
        handleCancel
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
