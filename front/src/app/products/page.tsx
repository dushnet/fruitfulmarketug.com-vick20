//this is the main products page that has the products grid
//filters
import { ListFilter } from "lucide-react";
import { ProductCardData } from "../components/product/types/product";
import ProductGrid from "../components/product/productGrid";
import { getProducts } from "../lib/product/productsProvider";

interface GridAttr {
  title: string;
  products: ProductCardData[];
  props: {};
}

export default function ProductsPage({ title, products, props }: GridAttr) {
  const columns = 2;
  products= products?? getProducts(true); //fetch from mock data for now, later we will fetch from the database
  return (
    <>
      <header className="${props.className} flex flex-row items-center align-center justify-between gap-2 p-5">
        <h2 className="text-lg font-bold"> {title ?? "All Proucts"}</h2>
        <button className="bg-primary text-text-light rounded-md flex flex-row px-3 py-2 items-center gap-2 ">
          <ListFilter /> Filters
        </button>
      </header>

      <div className="gridview-container px-2">
        <ProductGrid products={products} columns={columns} />
      </div>
    </>
  );
}
