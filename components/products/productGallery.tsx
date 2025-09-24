'use client'

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div className="details__group">
      <Image
        src={selected}
        alt={title}
        width={500}
        height={500}
        className="details__img"
        loading='lazy'
        unoptimized
      />

     
      <div className="details__small-images grid">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={title}
            width={100}
            height={100}
            className={`details__small-img ${selected === img ? 'active' : ''}`}
            onClick={() => setSelected(img)}
            style={{ cursor: 'pointer' }}
            loading='lazy'
            unoptimized
          />
        ))}
      </div>
    </div>
  );
}
