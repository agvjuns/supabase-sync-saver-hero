
import { Label } from '@/components/ui/label';
import { InventoryItem } from '@/services/inventory/types';
import { DollarSign, Package, List, TrendingDown, Truck } from 'lucide-react';

interface ItemAdditionalDetailsProps {
  item: InventoryItem;
}

const ItemAdditionalDetails = ({ item }: ItemAdditionalDetailsProps) => {
  // Format price with currency symbol
  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(price);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-blue-800 border-b border-blue-100 pb-2">Additional Details</h3>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <Label className="text-blue-800 font-medium text-base flex items-center">
            <DollarSign className="h-5 w-5 mr-1 text-blue-500" />
            Price
          </Label>
          <div className="mt-1 text-xl font-semibold">
            {formatPrice(item.price, item.currency)}
          </div>
        </div>
        
        <div>
          <Label className="text-blue-800 font-medium text-base flex items-center">
            <List className="h-5 w-5 mr-1 text-blue-500" />
            Unit of Measurement
          </Label>
          <div className="mt-1 text-base">{item.uom}</div>
        </div>
        
        {item.sku && (
          <div>
            <Label className="text-blue-800 font-medium text-base flex items-center">
              <Package className="h-5 w-5 mr-1 text-blue-500" />
              SKU
            </Label>
            <div className="mt-1 text-base">{item.sku}</div>
          </div>
        )}
        
        <div>
          <Label className="text-blue-800 font-medium text-base flex items-center">
            <TrendingDown className="h-5 w-5 mr-1 text-blue-500" />
            Minimum Stock Level
          </Label>
          <div className="mt-1 text-base">
            {item.minimumStock} {item.uom}
            {item.quantity < item.minimumStock && (
              <span className="ml-2 text-red-500 text-base font-medium">
                ⚠️ Below minimum stock level
              </span>
            )}
          </div>
        </div>
        
        {item.supplierInfo && (
          <div className="col-span-2">
            <Label className="text-blue-800 font-medium text-base flex items-center">
              <Truck className="h-5 w-5 mr-1 text-blue-500" />
              Supplier Information
            </Label>
            <div className="mt-1 text-base">{item.supplierInfo}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemAdditionalDetails;
