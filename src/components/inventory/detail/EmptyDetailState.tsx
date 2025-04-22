
import { Package2 } from 'lucide-react';

const EmptyDetailState = () => {
  return (
    <div className="h-full flex items-center justify-center p-8 text-center bg-muted/20">
      <div>
        <Package2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No item selected</h3>
        <p className="text-muted-foreground mt-1">Select an item from the list to view details</p>
      </div>
    </div>
  );
};

export default EmptyDetailState;
