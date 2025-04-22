
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthMethods = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsSigningUp(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success('Account created! Check your email to confirm.');
      return true;
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
      return false;
    } finally {
      setIsSigningUp(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoggingOut(true);
      
      // First make sure we have a session before trying to sign out
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      
      // Call the delete-user edge function
      const { error } = await supabase.functions.invoke('delete-user', {});
      
      if (error) throw error;
      
      // Sign out the user after successful deletion
      await supabase.auth.signOut();
      
      navigate('/login');
      return true;
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
      return false;
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return { 
    signIn, 
    signUp, 
    signOut, 
    deleteAccount,
    isLoggingIn, 
    isSigningUp, 
    isLoggingOut,
    isDeletingAccount
  };
};
