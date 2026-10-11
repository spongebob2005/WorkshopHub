import { useState } from 'react';

/**
 * Cover photo for a workshop. Seed data stores image *keywords*
 * ("programming workspace laptop") rather than URLs, so non-URL values map to a
 * stable seeded photo. A neutral tone sits underneath while it loads.
 */

export const isImageUrl = (src?: string) => !!src && /^(https?:|data:|blob:|\/)/.test(src);

const photoFor = (image: string | undefined, title: string) => {
  if (isImageUrl(image)) return image!;
  const seed = encodeURIComponent((image || title).trim().toLowerCase().replace(/\s+/g, '-'));
  return `https://picsum.photos/seed/${seed}/960/540?grayscale`;
};

interface WorkshopCoverProps {
  category: string;
  image?: string;
  title: string;
  className?: string;
  /** Kept for API compatibility; covers no longer draw a monogram */
  monogram?: boolean;
  imageClassName?: string;
}

export const WorkshopCover = ({ image, title, className = '', imageClassName = '' }: WorkshopCoverProps) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      {!failed && (
        <img
          src={photoFor(image, title)}
          alt={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imageClassName}`}
        />
      )}
    </div>
  );
};
