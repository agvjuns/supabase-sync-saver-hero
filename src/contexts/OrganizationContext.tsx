import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type OrganizationContextType = {
  isLoading: boolean;
  isSaving: boolean;
  isLoadingStripe: boolean;
  isLoadingMembers: boolean;
  orgMembers: any[];
  userOrganization: any;
  formData: {
    name: string;
    subscriptionTier: string;
    billingEmail: string;
  };
  setFormData: (data: any) => void;
  fetchOrgMembers: () => Promise<void>;
  handleOpenBillingPortal: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  handleEdit: () => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setIsSaving: (value: boolean) => void;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [orgMembers, setOrgMembers] = useState<any[]>([]);
  const [userOrganization, setUserOrganization] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    subscriptionTier: '',
    billingEmail: ''
  });

  const { user } = useAuth();

  const fetchOrgMembers = async () => {
    try {
      if (!userOrganization?.id) return;
      
      setIsLoadingMembers(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', userOrganization.id);
        
      if (error) throw error;
      setOrgMembers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching organization members:', error);
      toast.error('Failed to load team members: ' + error.message);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    try {
      setIsLoadingStripe(true);
      toast.info('Billing portal functionality not yet implemented');
    } catch (error: any) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handleSave = async () => {
    if (!userOrganization) return;
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          billing_email: formData.billingEmail
        })
        .eq('id', userOrganization.id);
        
      if (error) throw error;
      setIsEditing(false);
      toast.success('Organization updated successfully');
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userOrganization) {
      setFormData({
        name: userOrganization.name || '',
        subscriptionTier: userOrganization.subscription_tier || 'free',
        billingEmail: userOrganization.billing_email || ''
      });
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <OrganizationContext.Provider
      value={{
        isLoading,
        isSaving,
        isLoadingStripe,
        isLoadingMembers,
        orgMembers,
        userOrganization,
        formData,
        setFormData,
        fetchOrgMembers,
        handleOpenBillingPortal,
        handleSave,
        handleCancel,
        handleEdit,
        isEditing,
        setIsEditing,
        setIsSaving,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
