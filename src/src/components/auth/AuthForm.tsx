import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, Loader2, User, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type AuthFormProps = {
  type: 'login' | 'signup';
};

const AuthForm = ({ type }: AuthFormProps) => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const isLogin = type === 'login';
  const title = isLogin ? 'Log in to your account' : 'Create an account';
  const buttonText = isLogin ? 'Sign in' : 'Create account';
  const toggleText = isLogin 
    ? "Don't have an account?" 
    : "Already have an account?";
  const toggleLink = isLogin ? '/signup' : '/login';
  const toggleLinkText = isLogin ? 'Sign up' : 'Log in';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Logged in successfully!');
      } else {
        await signUp(email, password, name);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDuration: '10s'}} />
      
      <Card className="border-primary/10 bg-background/95 backdrop-blur-sm shadow-xl animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Enter your information to create an account'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-primary/10 focus:border-primary focus:ring-primary/20 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization" className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Enter your organization name"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    className="border-primary/10 focus:border-primary focus:ring-primary/20 rounded-md"
                  />
                </div>
              </>
            )}
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
                className="border-primary/10 focus:border-primary focus:ring-primary/20 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Password
                </Label>
                {isLogin && (
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-primary hover:underline font-bold"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 border-primary/10 focus:border-primary focus:ring-primary/20 rounded-md"
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
            {!isLogin && (
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit"
              className="w-full font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {toggleText}{' '}
              <Link to={toggleLink} className="text-primary hover:underline font-bold">
                {toggleLinkText}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;
