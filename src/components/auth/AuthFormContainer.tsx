
import { ReactNode } from 'react';

interface AuthFormContainerProps {
  children: ReactNode;
}

export const AuthFormContainer = ({ children }: AuthFormContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_60%,hsl(var(--primary)/0.08)_0%,transparent_100%)]" />
      </div>
      
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDuration: '8s'}} />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{animationDuration: '10s'}} />
      
      <div className="max-w-md w-full mx-auto">
        {children}
      </div>
    </div>
  );
};
