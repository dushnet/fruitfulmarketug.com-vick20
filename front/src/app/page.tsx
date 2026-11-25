import ProductGrid from '../components/product/productGrid';
import HeroSlider from '../components/slider';
import {mockProducts} from '../test/productMokeData';

export default function Home() {
  return (
    <div className="overflow-x-none items-center flex flex-col flex-1 items-center justify-center bg-background font-sans dark:bg-black">
      <main className=" w-full min-h-screen p-3">
        <div className="mt-4">
          <HeroSlider />
        </div>

        {/* feated productgrid */}
        <div className="sticky top-[56px] z-40 flex flex-row justify-between mb-2 text-primary">
          <p className=''>featured products</p>
          <button>see all</button>
        </div>
        <ProductGrid products={mockProducts} columns={3}/>
      </main >

     

    </div >
  );
}
