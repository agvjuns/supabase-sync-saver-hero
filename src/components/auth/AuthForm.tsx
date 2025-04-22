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
  const { signIn, signUp, isLoading } = useAuth();
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
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 to-slate-800 opacity-90" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/20 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/20 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '10s' }} />

      <Card className="border-slate-700 bg-slate-800/95 backdrop-blur-sm shadow-xl animate-fade-in text-white">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{isLogin ? 'Enter your credentials to access your account' : 'Enter your information to create an account'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            {isLogin ? (
              <Button type="submit" className="w-full py-2 rounded-md bg-slate-500 hover:bg-slate-600 text-white font-semibold shadow">
                {buttonText}
              </Button>
            ) : (
              <>
                <div className="mb-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-2 rounded-md bg-slate-500 hover:bg-slate-600 text-white font-semibold shadow">
                  {buttonText}
                </Button>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Link to={toggleLink}>
              <Button variant="link" className="text-slate-400 hover:text-slate-500">
                {toggleText}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
