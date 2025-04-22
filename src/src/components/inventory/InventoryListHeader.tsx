
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const InventoryListHeader = () => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0">
      <TableRow>
        <TableHead className="w-[300px] text-base">
          <Button variant="ghost" className="p-0 font-medium text-base flex items-center gap-1 hover:bg-transparent">
            Name
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead className="text-base">Location</TableHead>
        <TableHead className="text-base">
          <Button variant="ghost" className="p-0 font-medium text-base flex items-center gap-1 hover:bg-transparent">
            Status
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead className="text-right text-base">
          <Button variant="ghost" className="p-0 font-medium text-base flex items-center gap-1 justify-end hover:bg-transparent">
            Quantity
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </TableHead>
        <TableHead className="text-right text-base">Updated</TableHead>
        <TableHead className="w-8"></TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default InventoryListHeader;
