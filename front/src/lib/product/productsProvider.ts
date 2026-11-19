import { mockProducts } from "../../test/productMokeData";
import type { ProductCardData } from "../../components/product/types/product";

export function getProducts(test:boolean){
    const products:ProductCardData[] = test? mockProducts: fetchProductsFromDB();
    return products ;
}

//fetch from the database
function fetchProductsFromDB(): ProductCardData[] {
    // Implement your database fetching logic here
    // For example, you might use an ORM or a database client to query your products table
    // Return the fetched products as an array of objects
    return [];
}

// export function getProductsFromDB(): any[] {
//     const products = fetchProductsFromDB();
//     return toProductCardData(products);
// }