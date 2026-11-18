import {ShoppingCart} from 'lucide-react'
import ProductGrid from '../components/product/productGrid';
import {mockProducts} from '../test/productMokeData';

export default function Home() {
  return (
    <div className="overflow-x-none items-center flex flex-col flex-1 items-center justify-center bg-background font-sans dark:bg-black">
      <main className=" w-full min-h-screen p-3">
        <div style={{ backgroundImage: 'url("/bg1.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="relative min-h-100 mt-4 rounded-md p-3">
          <p className="text-[2.5rem] text-background font-bold ">Fruitful<span className="text-accent">marketUg</span></p>
           <p className ="text-background text-[1.5rem] font-bold"> Trusted freshness</p>
          <div className=" flex flex-row items-center justify-between w-full  ">
              <div className='flex flex-col gap-2  items-center h-fit '>

               <button className=" text-[1.2rem] rounded-full border-none bg-accent px-4 py-1 h-fit hover:bg-red-500">explore</button>
               <div className="flex flex-row  gap-1 rounded-full   px-4 py-1 border-none bg-accent ">
                 <button className=" ">shop </button>
                 <ShoppingCart className="text-white"/>
               </div>

              <p className="subtext hidden ">Your trusted source for fresh, healthy fruits, vetgetables and herbs. </p>
            </div>  

            <img src="/full_shopping.webp" className="  size-60  flex  " />
          </div>
        </div>

        {/* feated productgrid */}
        <div className="sticky top-[56px] z-40 flex flex-row justify-between mb-2 text-primary">
          <p className=''>featured products</p>
          <button>see all</button>
        </div>
        <ProductGrid products={mockProducts}/>
      </main >

     

    </div >
  );
}
