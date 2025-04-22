
import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { InventoryItem, useInventory } from '@/hooks/useInventory';
import SearchBar from './SearchBar';
import InventoryListHeader from './InventoryListHeader';
import InventoryListItem from './InventoryListItem';
import AddItemForm from './forms/AddItemForm';

interface InventoryListProps {
  onItemSelect: (item: InventoryItem) => void;
  onItemHover: (item: InventoryItem | null) => void;
  selectedItem: InventoryItem | null;
}

const InventoryList = ({ onItemSelect, onItemHover, selectedItem }: InventoryListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { items, loading, deleteItem } = useInventory();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleOpenAddForm = () => {
    console.log("Opening add form");
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    console.log("Closing add form");
    setIsAddFormOpen(false);
  };

  const filteredInventory = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Inventory</h2>
          <Button 
            size="sm" 
            onClick={handleOpenAddForm}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-200 shadow-md hover:shadow-lg text-base px-4 py-2"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Item
          </Button>
        </div>
        
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
          onClear={clearSearch}
        />
      </div>

      <div className="flex-grow overflow-auto border-t border-border">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <InventoryListHeader />
            <TableBody className="overflow-y-auto">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <InventoryListItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={onItemSelect}
                    onHover={onItemHover}
                    onDelete={handleDeleteItem}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-base">
                    {searchTerm ? 'No results found.' : 'No inventory items yet. Add your first item!'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Item Form Dialog */}
      <AddItemForm 
        isOpen={isAddFormOpen}
        onClose={handleCloseAddForm}
      />
    </div>
  );
};

export default InventoryList;
