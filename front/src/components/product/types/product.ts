
/* =========================
   Database types
========================= */

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductCategory {
  product_id: number;
  category_id: number;
}

export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface VariantAttribute {
  id: number;
  variant_id: number;
  name: string;
  value: string;
  price: number | null;
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

/* =========================
   Storefront response types
========================= */

export interface VariantWithAttributes extends Variant {
  attributes: VariantAttribute[];
}

export interface ProductWithDetails extends Product {
  categories: Category[];
  images: ProductImage[];
  variants: VariantWithAttributes[];
}

/* =========================
   Product card types
========================= */

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  categories: Category[];
  images: ProductImage[];
  variants: VariantWithAttributes[];
}

/* =========================
   Category page types
========================= */

export interface CategoryWithProducts extends Category {
  products: ProductCardData[];
}


