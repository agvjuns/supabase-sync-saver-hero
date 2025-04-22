
import { useState, useMemo } from 'react';
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
// Correctly import types along with the default export
import InventoryListHeader, { type SortKey, type SortConfig, type SortDirection } from './InventoryListHeader';
import InventoryListItem from './InventoryListItem';
import AddItemForm from './forms/AddItemForm';

interface InventoryListProps {
  onItemSelect: (item: InventoryItem) => void;
  onItemHover: (item: InventoryItem | null) => void;
  selectedItem: InventoryItem | null;
}

const InventoryList = ({ onItemSelect, onItemHover, selectedItem }: InventoryListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  // Add state for sorting configuration
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const { items, loading, deleteItem } = useInventory();

  // Extract unique categories from items
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [items]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Function to handle sorting when a header is clicked
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    // If already sorting by this key ascending, switch to descending
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    // Otherwise, sort ascending by the new key
    setSortConfig({ key, direction });
  };

  const handleOpenAddForm = () => {
    console.log("Opening add form");
    setIsAddFormOpen(true);
  };

  const handleCloseAddForm = () => {
    console.log("Closing add form");
    setIsAddFormOpen(false);
  };

  // Renamed to processedInventory as it now includes filtering AND sorting
  const processedInventory = useMemo(() => {
    // 1. Filter items first
    const filtered = items.filter(item => { // Changed let to const
      // Text search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // 2. Sort the filtered items if a sort configuration exists
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        // Ensure values exist before comparison, default to a sensible value if not
        const aValue = a[sortConfig.key] ?? (sortConfig.key === 'quantity' ? 0 : '');
        const bValue = b[sortConfig.key] ?? (sortConfig.key === 'quantity' ? 0 : '');

        // Comparison logic
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0; // Values are equal
      });
    }

    return filtered;
  }, [items, searchTerm, selectedCategory, sortConfig]); // Added sortConfig to dependency array

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
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      <div className="flex-grow overflow-auto border-t border-border">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            {/* Pass sortConfig state and handleSort function to the header */}
            <InventoryListHeader sortConfig={sortConfig} onSort={handleSort} />
            <TableBody className="overflow-y-auto">
              {/* Use processedInventory which includes sorting */}
              {processedInventory.length > 0 ? (
                processedInventory.map((item) => (
                  <InventoryListItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={onItemSelect}
                    onHover={onItemHover}
                    onDelete={handleDeleteItem}
                    formatDate={formatDate}
                    categories={categories}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-base">
                    {searchTerm || selectedCategory ? 'No results found.' : 'No inventory items yet. Add your first item!'}
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
        categories={categories}
      />
    </div>
  );
};

export default InventoryList;
