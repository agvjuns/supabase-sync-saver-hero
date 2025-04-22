
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check, EyeIcon, EyeOffIcon, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AcceptInvite = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<{
    organizationId: string;
    organizationName: string;
    role: string;
  } | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  useEffect(() => {
    // Get invitation parameters from URL
    const organizationId = searchParams.get('organizationId');
    const organizationName = searchParams.get('organizationName');
    const role = searchParams.get('role') || 'user';
    
    if (organizationId && organizationName) {
      setInviteInfo({
        organizationId,
        organizationName,
        role
      });
      
      if (user) {
        // If user is already logged in, check if they need to be redirected to dashboard
        toast.info('You are already logged in. Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } else {
      toast.error('Invalid invitation link');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteInfo) {
      toast.error('Invalid invitation information');
      return;
    }
    
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
      // Get the signup confirmation from the URL hash if present
      const hash = window.location.hash;
      
      // If there's a session in the URL (from the email link)
      if (hash && hash.includes('access_token')) {
        console.log('Found access token in URL hash');
        
        // First, sign in using the hash
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          throw sessionError;
        }
        
        console.log('Session data:', sessionData);
        
        // Update the user's password
        const { error } = await supabase.auth.updateUser({ password });
        
        if (error) {
          console.error('Error updating user password:', error);
          throw error;
        }
        
        toast.success('Your account has been set up successfully');
        navigate('/dashboard');
      } else {
        console.error('No access token found in URL hash');
        toast.error('Invalid invitation link. Please use the link from your email.');
      }
    } catch (error: any) {
      console.error('Error setting up account:', error);
      toast.error(`Error setting up account: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (!inviteInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              The invitation link appears to be invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="border-primary/10 bg-background/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center">
              Join {inviteInfo.organizationName}
            </CardTitle>
            <CardDescription className="text-center">
              You've been invited to join as a {inviteInfo.role}. Set your password to complete your registration.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Create a secure password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up Your Account...</>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvite;
