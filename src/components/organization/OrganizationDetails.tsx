
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from '@/components/ui/card';
import { OrganizationProvider } from './OrganizationContext';
import { OrganizationHeader } from './OrganizationHeader';
import { OrganizationForm } from './OrganizationForm';
import { OrganizationInfoFields } from './OrganizationInfoFields';

interface OrganizationDetailsProps {
  userProfile: any;
  userOrganization: any;
  formatDate: (dateString: string) => string;
}

const OrganizationDetails = ({ userProfile, userOrganization, formatDate }: OrganizationDetailsProps) => {
  const isAdmin = userProfile?.role === 'admin';

  return (
    <OrganizationProvider userProfile={userProfile} userOrganization={userOrganization}>
      <Card className="bg-slate-800 border border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <OrganizationHeader isAdmin={isAdmin} />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <OrganizationForm isAdmin={isAdmin} />
          
          <OrganizationInfoFields 
            subscriptionTier={userOrganization?.subscription_tier}
            createdAt={userOrganization?.created_at}
            formatDate={formatDate}
          />
        </CardContent>
      </Card>
    </OrganizationProvider>
  );
};

export default OrganizationDetails;
