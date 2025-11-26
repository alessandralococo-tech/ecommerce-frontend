export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  available_quantity: number;
  image_url: string | null;
  sku: string | null;
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category_id: number | null;
};