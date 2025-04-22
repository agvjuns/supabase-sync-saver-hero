
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { AuthError } from '@supabase/supabase-js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the current URL to build an absolute URL for the redirect
      const origin = window.location.origin;
      const redirectTo = `${origin}/reset-password`;
      
      console.log("Redirecting to:", redirectTo);
      
      console.log("Attempting password reset for:", email);
      console.log("Using redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        console.error("Supabase auth error details:", {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }
      
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      const authError = error as AuthError;
      console.error('Password reset error:', {
        message: authError.message,
        name: authError.name,
        status: authError.status
      });
      
      // Provide more user-friendly error messages
      if (authError.message?.includes('rate limit') || authError.status === 429) {
        toast.error('Too many password reset attempts. Please wait a few minutes before trying again.');
      } else if (authError.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (authError.message?.includes('email')) {
        toast.error('Please check your email address and try again.');
      } else {
        toast.error(authError.message || 'Failed to send reset link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_60%,hsl(var(--primary)/0.08)_0%,transparent_100%)]" />
      </div>
      
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDuration: '10s'}} />
      
      <div className="max-w-md w-full mx-auto">
        <Card className="border-primary/10 bg-background/95 backdrop-blur-sm shadow-xl animate-fade-in">
          <CardHeader className="space-y-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight text-center">
              {submitted ? 'Check your email' : 'Reset password'}
            </CardTitle>
            <CardDescription className="text-center">
              {submitted 
                ? `We've sent a password reset link to ${email}` 
                : 'Enter your email and we\'ll send you a link to reset your password'}
            </CardDescription>
          </CardHeader>
          
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-primary/10 focus:border-primary focus:ring-primary/20 rounded-md placeholder:text-muted-foreground"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit"
                  className="w-full font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send reset link
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                <div className="text-center text-sm">
                  <Link to="/login" className="text-primary hover:underline font-bold flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                If you don't see the email in your inbox, check your spam folder.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button 
                    className="w-full font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Return to login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
