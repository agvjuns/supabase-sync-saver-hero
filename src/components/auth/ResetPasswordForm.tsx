
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PasswordField } from './PasswordField';
import type { AuthError } from '@supabase/supabase-js';

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      console.log("Updating password");
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      
      // Delay navigation to show the success toast
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const authError = error as AuthError;
      console.error('Password reset error:', {
        message: authError.message,
        status: authError.status,
        name: authError.name
      });
      
      if (authError.message?.includes('session')) {
        toast.error('Your password reset link has expired. Please request a new one.');
      } else {
        toast.error(authError.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/10 bg-background/95 backdrop-blur-sm shadow-xl animate-fade-in">
      <CardHeader className="space-y-1">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-center">
          Set new password
        </CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <PasswordField
            id="password"
            label="New Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter new password"
          />
          
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your password"
          />
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit"
            className="w-full font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset password
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
