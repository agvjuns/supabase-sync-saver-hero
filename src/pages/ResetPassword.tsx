
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthFormContainer } from '@/components/auth/AuthFormContainer';
import { InvalidResetToken } from '@/components/auth/InvalidResetToken';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  const [tokenValidated, setTokenValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Check for auth events when component mounts
  useEffect(() => {
    console.log("Reset password page loaded, checking for auth state");
    
    const validateToken = async () => {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      // Check for recovery token in URL
      const hash = window.location.hash;
      if (hash.includes('type=recovery')) {
        console.log("Found recovery token in URL");
        
        // Clear the URL hash to prevent re-triggering
        window.location.hash = '';
        
        // Verify we have no active session
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          setTokenValidated(true);
          toast.info('Please set a new password for your account');
        } else {
          // If session still exists, force reload
          window.location.reload();
        }
      }
    };

    validateToken();
    
    // Set up auth state listener as backup
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        validateToken();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // If no recovery token was detected, show an error message
  if (!tokenValidated && !loading) {
    return (
      <AuthFormContainer>
        <InvalidResetToken />
      </AuthFormContainer>
    );
  }

  return (
    <AuthFormContainer>
      <ResetPasswordForm />
    </AuthFormContainer>
  );
};

export default ResetPassword;
