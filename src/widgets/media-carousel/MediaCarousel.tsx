'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from './MediaCarousel.module.scss';

type MediaCarouselProps = {
  alt: string;
  images: string[];
};

export function MediaCarousel({ alt, images }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ['/images/logo.jpg'];

  useEffect(() => {
    if (safeImages.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % safeImages.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [safeImages.length]);

  return (
    <div className={styles.root}>
      {safeImages.map((image, index) => (
        <Image
          alt={index === activeIndex ? alt : ''}
          aria-hidden={index === activeIndex ? undefined : true}
          className={`${styles.image} ${index === activeIndex ? styles.imageActive : ''}`}
          fill
          key={image}
          sizes="(max-width: 900px) 100vw, 48vw"
          src={image}
        />
      ))}

      {safeImages.length > 1 ? (
        <div className={styles.dots} aria-label="Фотографии проекта">
          {safeImages.map((image, index) => (
            <button
              aria-label={`Показать фото ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
              key={image}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
