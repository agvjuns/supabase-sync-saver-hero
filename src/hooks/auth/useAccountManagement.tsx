
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAccountManagement = () => {
  const navigate = useNavigate();

  const deleteAccount = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to delete your account");
        return;
      }

      const supabaseUrl = "https://iseemjooeveamnkknijs.supabase.co";
      
      console.log("Calling delete-user function at:", `${supabaseUrl}/functions/v1/delete-user`);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorData = {};
        try {
          const text = await response.text();
          console.log("Error response text:", text);
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (e) {
          console.error("Error parsing response:", e);
          throw new Error(`Failed to delete account: Server returned ${response.status}`);
        }

        throw new Error((errorData as any).error || `Failed to delete account: ${response.statusText}`);
      }

      toast.success("Your account has been permanently deleted");
      navigate('/login');
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    }
  };

  return {
    deleteAccount
  };
};
