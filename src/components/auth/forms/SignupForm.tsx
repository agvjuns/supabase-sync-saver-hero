
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, Building, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  organization: z.string().min(2, { message: 'Organization must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms' })
});

type SignupValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (values: SignupValues) => Promise<void>;
  loading: boolean;
}

const SignupForm = ({ onSubmit, loading }: SignupFormProps) => {
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      organization: '',
      email: '',
      password: '',
      terms: false
    },
    mode: 'onSubmit'
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center text-slate-200">
                  <User className="h-4 w-4 mr-2 text-blue-400" />
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
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
            name="organization"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center text-slate-200">
                  <Building className="h-4 w-4 mr-2 text-blue-400" />
                  Organization
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your organization name"
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
                <FormLabel className="flex items-center text-slate-200">
                  <Lock className="h-4 w-4 mr-2 text-blue-400" />
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="border-slate-600 bg-slate-800 text-white focus:border-blue-500 focus:ring-blue-500/30 rounded-md placeholder:text-slate-500 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="font-medium text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-slate-500"
                  />
                </FormControl>
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none text-slate-300"
                  >
                    I agree to the <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                  </label>
                  <FormMessage className="font-medium text-red-400" />
                </div>
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
            Create account
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
          <div className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-bold">
              Log in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
