
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NotFoundProps {
  comingSoon?: string;
}

const NotFound = ({ comingSoon }: NotFoundProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4 text-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          {comingSoon ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z"></path><path d="m8 12 4 4"></path><path d="m16 8-8 8"></path><path d="m8 8 0 0"></path><path d="m16 16 0 0"></path></svg>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-primary mb-2">
          {comingSoon ? 'Coming Soon' : '404'}
        </h1>
        
        <p className="text-xl mb-6 text-muted-foreground">
          {comingSoon 
            ? `The ${comingSoon} feature is currently under development.`
            : "The page you're looking for doesn't exist."}
        </p>
      </div>
      
      <Button asChild>
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
