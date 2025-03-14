import {Skeleton} from '@/components/ui/skeleton';
import React from 'react';

export default function loading() {
  return (
    <div className='py-6'>
      <h1 className='text-xl font-semibold my-6'>Quiz Dashboard</h1>
      <div className='flex flex-col gap-6'>
      <Skeleton className="w-full h-32" />
      </div>
    </div>
  );
}
