import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCartActions from "@/src/components/product/ProductCartActions";
import ProductGallery from "@/src/components/product/ProductGallery";
import type { ProductCardData } from "@/src/components/product/types/product";
import { getProducts } from "@/src/lib/product/productsProvider";
import { createProductJsonLd } from "@/src/lib/product/product-schema";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};
function getProduct(id: string): ProductCardData | undefined {
  //get test data from the mock data for now, later we will fetch from the database
  return getProducts(true).at(2);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return { title: "Product not found | Fruitful Market UG" };
  }

  return {
    title: `${product.name} | Fruitful Market UG`,
    description:
      product.description ?? `Shop ${product.name} at Fruitful Market UG.`,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Fruitful Market UG`,
      description:
        product.description ?? `Shop ${product.name} at Fruitful Market UG.`,
      type: "website",
      images: product.images.map((image) => ({
        url: image.url,
        alt: image.alt_text ?? product.name,
      })),
    },
  };
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const productJsonLd = createProductJsonLd(product);
  const jsonLd = JSON.stringify(productJsonLd).replace(/</g, "\\u003c");
  const activeVariants = product.variants.filter((variant) => variant.is_active);

  return (
    <section
      aria-labelledby="product-page-title"
      className="container mx-auto max-w-6xl px-4 py-8"
    >
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span aria-hidden="true" className="px-2">
          /
        </span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <span aria-hidden="true" className="px-2">
          /
        </span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery productName={product.name} images={product.images} />

        <div className="space-y-6">
          {product.categories[0] && (
            <p className="text-sm font-medium text-text-muted">
              {product.categories[0].name}
            </p>
          )}
          <div>
            <h1
              id="product-page-title"
              className="text-3xl font-bold text-primary md:text-4xl"
            >
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-4 leading-relaxed text-text-muted">
                {product.description}
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-primary">
              Available options
            </h2>
            {activeVariants.length > 0 ? (
              <ul className="space-y-3">
                {activeVariants.map((variant) => (
                  <li
                    key={variant.id}
                    className="rounded-lg border border-border p-3"
                  >
                    <p className="font-medium text-primary">
                      {variant.attributes.length > 0
                        ? variant.attributes
                            .map(
                              (attribute) =>
                                `${attribute.name}: ${attribute.value}`,
                            )
                            .join(", ")
                        : variant.sku}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      SKU: {variant.sku} · UGX{" "}
                      {variant.price.toLocaleString("en-UG")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted">No options are currently available.</p>
            )}
          </div>

          <ProductCartActions product={product} variants={activeVariants} />
        </div>
      </div>
    </section>
  );
}
