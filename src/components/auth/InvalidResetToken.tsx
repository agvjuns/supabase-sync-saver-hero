
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const InvalidResetToken = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-md w-full border-primary/10 bg-background/95 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight text-center">Invalid Reset Link</CardTitle>
        <CardDescription className="text-center">
          This password reset link is invalid or has expired.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p>Please request a new password reset link.</p>
        <Button 
          onClick={() => navigate('/forgot-password')}
          className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Request New Link
        </Button>
      </CardContent>
    </Card>
  );
};
