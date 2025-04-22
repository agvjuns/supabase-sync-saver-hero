
import { InventoryItem } from '@/services/inventory/types';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, MapPin, Calendar, DollarSign, Package, Store } from 'lucide-react';
import StatusBadge from '../StatusBadge';

interface ItemDetailCardProps {
  item: InventoryItem;
}

const ItemDetailCard = ({ item }: ItemDetailCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="mx-auto max-w-5xl border-none shadow-none bg-transparent">
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 p-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-blue-600 flex items-center gap-1">
            <Package className="h-4 w-4 text-blue-500" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-1">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-sm font-medium">{item.category || 'Uncategorized'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="pt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">SKU</p>
              <p className="text-sm font-medium">{item.sku || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">UOM</p>
              <p className="text-sm font-medium">{item.uom || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-medium text-blue-600 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-blue-500" /> Location Information
          </h3>
          <div className="grid grid-cols-1 gap-1">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-sm font-medium">{item.location || 'No location'}</p>
            </div>
            {item.coordinates && (
              <div>
                <p className="text-sm text-gray-500">Coordinates</p>
                <p className="text-sm font-medium">
                  {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-medium text-blue-600 flex items-center gap-1">
            <Layers className="h-4 w-4 text-blue-500" /> Stock Information
          </h3>
          <div className="grid grid-cols-1 gap-1">
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="text-sm font-medium">{item.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Stock</p>
              <p className="text-sm font-medium">{item.minimumStock || 'Not set'}</p>
            </div>
            {item.supplierInfo && (
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="text-sm font-medium">{item.supplierInfo}</p>
                <p className="text-sm font-medium"><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.supplierInfo || '')}`}
                 target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium"><i className="fas fa-directions mr-1">
                 </i>Open Supplier in Google Maps</a></p>
              </div>
            )}
          </div>
        </div>

        {/* Price information and dates row */}
        <div className="space-y-1 md:col-span-3 grid md:grid-cols-3 gap-x-4 mt-2">
          <div>
            <h3 className="text-base font-medium text-blue-600 flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-blue-500" /> Price Information
            </h3>
            <div className="mt-1">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-sm font-medium">
                {item.price ? `${item.price} ${item.currency || 'USD'}` : 'Not set'}
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-base font-medium text-blue-600 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-500" /> Last Updated
            </h3>
            <p className="text-sm mt-1">{formatDate(item.lastUpdated)}</p>
          </div>
        </div>

        {/* Description - only show if it exists */}
        {item.description && (
          <div className="space-y-1 md:col-span-3 mt-2">
            <h3 className="text-base font-medium text-blue-600">Description</h3>
            <p className="text-sm">{item.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemDetailCard;
