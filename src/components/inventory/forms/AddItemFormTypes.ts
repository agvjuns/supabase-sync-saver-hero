
import * as z from 'zod';

export const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category: z.string(),
  quantity: z.number().min(0),
  status: z.string(),
  location: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string(),
  uom: z.string(),
  sku: z.string().optional(),
  minimumStock: z.number().min(0),
  supplierInfo: z.string().optional()
});

export type FormValues = z.infer<typeof FormSchema>;

export interface AddItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
}
