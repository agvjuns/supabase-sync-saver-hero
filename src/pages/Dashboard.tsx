
import { useInventory } from '@/hooks/useInventory';
import { useUserProfile } from '@/hooks/useUserProfile';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { items, loading } = useInventory();
  const { userProfile, userOrganization } = useUserProfile();

  return (
    <DashboardLayout 
      title="Dashboard" 
      userProfile={userProfile} 
      userOrganization={userOrganization}
      hideSearchInput={true}
    >
      <DashboardContent items={items} loading={loading} />
    </DashboardLayout>
  );
};

export default Dashboard;
