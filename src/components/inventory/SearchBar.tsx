
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const SearchBar = ({ 
  searchTerm, 
  onSearch, 
  onClear,
  categories,
  selectedCategory,
  onCategoryChange
}: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const handleCategoryReset = () => {
    onCategoryChange(null);
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          className="pl-9 pr-9"
          value={searchTerm}
          onChange={onSearch}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant={isFilterOpen || selectedCategory ? "secondary" : "outline"} 
                  size="icon"
                  className={selectedCategory ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" : 
                    isFilterOpen ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" : ""}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Options</h4>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={selectedCategory || ""} 
                      onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedCategory && (
                    <div className="pt-2 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCategoryReset}
                      >
                        Clear Filter
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter by category</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SearchBar;
