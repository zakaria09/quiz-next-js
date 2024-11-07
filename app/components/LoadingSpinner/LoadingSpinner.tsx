import React from 'react';

type Sizes = 6 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96;

export default function LoadingSpinner({
  size = {height: 12, width: 12},
}: {
  size?: {width: Sizes; height: Sizes};
}) {
  return (
    <div
      className={`inline-block h-${size.height} w-${size.width} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
    >
      <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
        Loading...
      </span>
    </div>
  );
}
