import {Skeleton} from '@/components/ui/skeleton';
import React from 'react';

export default function loading() {
  const cards = new Array(5);
  return (
    <div>
      <h1 className='text-xl font-semibold my-6'>Quiz Dashboard</h1>
      <div className='flex gap-6'>
        {cards.map((_, ind) => (
          <Skeleton key={ind} className='h-4 w-[300px]' />
        ))}
      </div>
    </div>
  );
}
