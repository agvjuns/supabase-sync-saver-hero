
import { User } from 'lucide-react';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';

interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <CardHeader className="space-y-1">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 mx-auto mb-4 flex items-center justify-center">
        <User className="h-7 w-7 text-white" />
      </div>
      <CardTitle className="text-2xl font-semibold tracking-tight text-center text-white">
        {title}
      </CardTitle>
      <CardDescription className="text-center text-slate-300">
        {description}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
