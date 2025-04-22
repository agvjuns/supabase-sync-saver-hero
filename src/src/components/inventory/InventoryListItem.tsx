
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InventoryItem } from '@/services/inventory/types';
import StatusBadge from './StatusBadge';

interface InventoryListItemProps {
  item: InventoryItem;
  isSelected: boolean;
  onSelect: (item: InventoryItem) => void;
  onHover: (item: InventoryItem | null) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  formatDate: (dateString: string) => string;
}

const InventoryListItem = ({
  item,
  isSelected,
  onSelect,
  onHover,
  onDelete,
  formatDate
}: InventoryListItemProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Select the item to open in detail view for editing
    onSelect(item);
  };

  return (
    <TableRow 
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
        isSelected ? 'bg-primary/5' : ''
      }`}
      onClick={() => onSelect(item)}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
    >
      <TableCell className="font-medium py-3 text-base">{item.name}</TableCell>
      <TableCell className="text-base">{item.location}</TableCell>
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell className="text-right text-base">{item.quantity}</TableCell>
      <TableCell className="text-right text-muted-foreground text-base">
        {formatDate(item.lastUpdated)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-md">
            <DropdownMenuItem 
              onClick={handleEdit}
              className="hover:bg-blue-50 font-medium text-sm"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => onDelete(item.id, e)}
              className="text-destructive font-medium text-sm hover:bg-red-50 focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default InventoryListItem;
