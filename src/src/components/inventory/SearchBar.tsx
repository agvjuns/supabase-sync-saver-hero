
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

const SearchBar = ({ searchTerm, onSearch, onClear }: SearchBarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
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
      <Button 
        variant={isFilterOpen ? "secondary" : "outline"} 
        size="icon"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
