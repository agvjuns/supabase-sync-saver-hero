import { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import ItemDetailCard from './detail/ItemDetailCard';
import EditItemForm from './forms/EditItemForm';
import { InventoryItem } from '@/services/inventory/types';
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

interface InventoryListItemProps {
  item: InventoryItem;
  isSelected: boolean;
  onSelect: (item: InventoryItem) => void;
  onHover: (item: InventoryItem | null) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  formatDate: (dateString: string) => string;
  categories: string[];
}

const InventoryListItem = ({
  item,
  isSelected,
  onSelect,
  onHover,
  onDelete,
  formatDate,
  categories,
}: InventoryListItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleOpenEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    onDelete(item.id, e);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <TableRow
        className={isSelected ? 'bg-blue-50' : ''}
        onClick={() => onSelect(item)}
        onMouseEnter={() => onHover(item)}
        onMouseLeave={() => onHover(null)}
        style={{ cursor: 'pointer' }}
      >
        <TableCell className="w-[180px] truncate">{item.name}</TableCell>
        <TableCell className="max-w-[160px] whitespace-normal break-words">{item.location}</TableCell>
        <TableCell className="w-[100px]">{item.status}</TableCell>
        <TableCell className="w-[80px] text-right">{item.quantity}</TableCell>
        <TableCell className="w-[110px] text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleOpenEditModal}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="Edit"
              style={{ marginRight: 2 }}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="p-1 text-red-600 hover:text-red-800"
              title="Delete"
              style={{ marginRight: 2 }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleExpandToggle}
              className="p-1 text-gray-500 hover:text-gray-800 focus:outline-none"
              title={expanded ? 'Collapse details' : 'Expand details'}
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
              tabIndex={0}
              style={{ background: 'none', border: 'none' }}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="bg-gray-50 border-t border-gray-100">
          <TableCell colSpan={5} className="p-0">
            <div className="py-2 px-4">
              <ItemDetailCard item={item} />
            </div>
          </TableCell>
        </TableRow>
      )}

      {/* Edit Form Modal */}
      <EditItemForm
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        item={item}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      {/* ...rest of component unchanged... */}
    </>
  );
};

export default InventoryListItem;
