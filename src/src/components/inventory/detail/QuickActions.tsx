
import { Button } from '@/components/ui/button';
import { ShoppingCart, BarChart } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="font-medium text-lg">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 px-4 justify-start">
          <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
          <div className="text-left">
            <div>Order More</div>
            <div className="text-xs text-muted-foreground">Restock this item</div>
          </div>
        </Button>
        <Button variant="outline" className="h-auto py-3 px-4 justify-start">
          <BarChart className="h-5 w-5 mr-2 text-primary" />
          <div className="text-left">
            <div>View Analytics</div>
            <div className="text-xs text-muted-foreground">Usage trends</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
