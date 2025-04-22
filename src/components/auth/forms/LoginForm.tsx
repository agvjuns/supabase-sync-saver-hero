
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void>;
  loading: boolean;
  error?: string; // Add an optional error prop
}

const LoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onSubmit'
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center text-slate-200">
                  <Mail className="h-4 w-4 mr-2 text-blue-400" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:ring-blue-500/30 rounded-md placeholder:text-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-medium text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center text-slate-200">
                    <Lock className="h-4 w-4 mr-2 text-blue-400" />
                    Password
                  </FormLabel>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-blue-400 hover:underline font-bold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:ring-blue-500/30 rounded-md placeholder:text-slate-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-medium text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 space-y-4">
          <Button 
            type="submit"
            className="w-full font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
          <div className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline font-bold">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
