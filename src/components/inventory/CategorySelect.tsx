import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CategorySelectProps {
  categories: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  includeAllOption?: boolean;
}

export default function CategorySelect({
  categories,
  value,
  onChange,
  includeAllOption = false,
}: CategorySelectProps) {
  return (
    <Select
      value={value || ""}
      onValueChange={(v) => onChange(v === "all" ? null : v)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {includeAllOption && (
          <SelectItem value="all">All Categories</SelectItem>
        )}
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}