import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-dark">
        Store Management
      </p>
      <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl">
        Admin
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-text-muted">
        Manage product listings, categories, pricing, and customer orders for
        Fruitful Market UG.
      </p>
      <div className="mt-8">
        <Link
          href="/products"
          className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          View Storefront Catalog
        </Link>
      </div>
    </section>
  );
}
