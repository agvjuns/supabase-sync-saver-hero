
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../AddItemFormTypes';
import PriceAndCurrencySection from './PriceAndCurrencySection';
import UomAndSkuSection from './UomAndSkuSection';
import MinimumStockAndSupplierSection from './MinimumStockAndSupplierSection';

interface AdditionalFieldsProps {
  form: UseFormReturn<FormValues>;
}

const AdditionalFieldsSection = ({ form }: AdditionalFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      <PriceAndCurrencySection form={form} />
      <UomAndSkuSection form={form} />
      <MinimumStockAndSupplierSection form={form} />
    </div>
  );
};

export default AdditionalFieldsSection;
