
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen,
  CreditCard,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPanelProps {
  userProfile: any;
  userOrganization: any;
  orgMembers?: any[]; // Make this prop optional
}

const SubscriptionPanel = ({ userProfile, userOrganization, orgMembers = [] }: SubscriptionPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleManageBilling = async () => {
    try {
      setIsLoading(true);
      toast.info('Billing portal functionality not yet implemented');
      setIsLoading(false);
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
      setIsLoading(false);
    }
  };

  const handleUpgradePlan = async () => {
    try {
      setIsLoading(true);
      toast.info('Plan upgrade functionality not yet implemented');
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to upgrade plan');
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow sticky top-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-white" />
          Subscription
        </CardTitle>
        <CardDescription className="text-slate-400">
          Manage your plan and billing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center mb-4">
          <div className="text-2xl font-bold text-white mb-1 capitalize">
            {userOrganization?.subscription_tier || 'Free'} Plan
          </div>
          <p className="text-sm text-slate-400 mb-4">
            {userOrganization?.subscription_status === 'active' 
              ? 'Active subscription' 
              : 'Upgrade for more features'}
          </p>
          <Button 
            onClick={handleUpgradePlan}
            disabled={isLoading || userOrganization?.subscription_status === 'active'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Upgrade Plan'
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Team Members</span>
            <span className="text-sm text-white">
              {orgMembers.length} / {userOrganization?.member_limit || 5}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Plan</span>
            <span className="text-sm text-white capitalize">
              {userOrganization?.subscription_tier || 'Free'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white">Status</span>
            <span className={`text-sm capitalize ${
              userOrganization?.subscription_status === 'active' 
                ? 'text-green-400' 
                : 'text-slate-400'
            }`}>
              {userOrganization?.subscription_status || 'Inactive'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-700 pt-4">
        <Button 
          variant="outline" 
          onClick={handleManageBilling}
          disabled={isLoading}
          className="w-full border-slate-600 text-white hover:bg-slate-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Billing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionPanel;
