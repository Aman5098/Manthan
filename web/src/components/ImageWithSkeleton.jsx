'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ImageWithSkeleton({ className = '', ...imageProps }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-black/10" />}
      <Image
        {...imageProps}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
