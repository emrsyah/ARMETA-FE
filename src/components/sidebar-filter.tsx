
import { ChartNoAxesColumnDecreasing, Funnel } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';

const SidebarFilter = () => {
  return (
    <div className='flex flex-col max-w-xs w-full h-full border-l-2 px-4'>
      <div className='text-xl font-bold  mt-4 px-4'>Filter & Sorting</div>
      <div className='p-4'>
        <div className='mb-2'>
          <Funnel className='inline-block mr-2 text-[#2067E9]' size={16} />
          <span className='font-semibold text-md'>Filter</span>
        </div>
        <div className='mb-1'>
          <Button variant="outline" size="sm" className=" border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Hari ini
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Minggu ini
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Bulan ini
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Tahun ini
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Kamu ikuti
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Gambar
          </Button>
        </div>
      </div>
      <div className='px-4 py-2'>
        <div className='mb-2'>
          <ChartNoAxesColumnDecreasing className='inline-block mr-2 text-[#2067E9]' size={16} />
          <span className='font-semibold text-md'>Sorting</span>
        </div>
        <div className='mb-1'>
          <Button variant="outline" size="sm" className=" border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Terbaru
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Pupuler
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Paling banyak dilihat
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Paling banyak dilike
          </Button>
          <Button variant="outline" size="sm" className= "border-black border-[1px] rounded-2xl mr-2 mb-2 px-2.5 py-1 justify-start">
            Paling banyak dibookmark
          </Button>
        </div>
      </div>
    </div>
    
  );
}

export default SidebarFilter

