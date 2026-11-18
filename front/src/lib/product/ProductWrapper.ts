
import type {
  Category,
  ProductImage,
  VariantWithAttributes,
  VariantAttribute,
  ProductCardData,
} from '../../components/product/types/product'
import { CartItem, createEmptyCart } from '../cart/cart-types';
/* =========================
   Raw mock data types
========================= */

type RawAttribute = {
  name: string;
  value: string;
  price?: number | null;
};

type RawVariant = {
  id: number;
  sku: string;
  price: number;
  attributes: RawAttribute[];
};

type RawImage = {
  url: string;
  alt_text?: string | null;
};

type RawCategory = {
  id: number;
  name: string;
  slug: string;
};

export type RawProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number;
  categories: RawCategory[];
  images: RawImage[];
  variants: RawVariant[];
};

/* =========================
   Mapper
========================= */

export function toProductCardData(
  raw: RawProduct
): ProductCardData {
  const now = new Date().toISOString();
  //console.log('prods len==================== ',raw);

  const categories: Category[] = raw.categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    created_at: now,
  }));

  const images: ProductImage[] = raw.images.map((image, index) => ({
    id: index + 1,
    product_id: raw.id,
    url: image.url,
    alt_text: image.alt_text ?? null,
    sort_order: index,
    created_at: now,
  }));

  const variants: VariantWithAttributes[] = raw.variants.map(
    (variant) => {
      const attributes: VariantAttribute[] =
        variant.attributes.map((attribute, index) => ({
          id: index + 1,
          variant_id: variant.id,
          name: attribute.name,
          value: attribute.value,
          price: attribute.price ?? null,
        }));

      return {
        id: variant.id,
        product_id: raw.id,
        sku: variant.sku,
        price: variant.price,
        is_active: true,
        created_at: now,
        attributes,
      };
    }
  );

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    base_price: raw.basePrice,
    categories,
    images,
    variants,
  };
}

export function toCartitem(item:ProductCardData):CartItem{
  const now = new Date().toISOString(); 
  return {
  variantId:item.variants[0].id.toString(),
  productId: item.images[0].product_id.toString(),
  name: item.name,
  image: item.images[0].url,
  unitPrice: item.variants[0].price,
  quantity: 0,
  }
}