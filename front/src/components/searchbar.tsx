"use-client";
import { FluidTyping } from '@/components/fluid-typing';
import { Search } from 'lucide-react';
// import { FluidTyping } from './components/fluid-typing';
export default function Searchbar(){
    return (
        <div className="relative rounded-full rounded-[var(--color-border)] flex items-center justify-space-between border-2 px-2 py-1 gap-1 ">
            <form action="/search" method="GET" className="flex-1 min-w-0 px-2">
            <input className="outline-none border-none w-full flex flex-1  " placeholder="search products |categories|etc..."></input>
            </form>
             
            <button className="search-button "><Search className= "search-icon size-4"/></button>
        </div>
    )
}