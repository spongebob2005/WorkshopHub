import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
]

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [fallbackIndex, setFallbackIndex] = useState(0)

  const handleError = () => {
    if (fallbackIndex < FALLBACK_IMAGES.length) {
      setFallbackIndex(prev => prev + 1)
    } else {
      setDidError(true)
    }
  }

  const { src, alt, style, className, ...rest } = props

  const currentSrc = didError ? ERROR_IMG_SRC : (fallbackIndex > 0 ? FALLBACK_IMAGES[fallbackIndex - 1] : src)

  return didError ? (
    <div
      className={`inline-block bg-gradient-to-br from-gray-100 to-gray-200 text-center align-middle rounded-t-2xl ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <img src={ERROR_IMG_SRC} alt="Error loading image" className="mx-auto mb-2 opacity-50" {...rest} data-original-url={src} />
          <p className="text-xs text-gray-500 px-2">Image unavailable</p>
        </div>
      </div>
    </div>
  ) : (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  )
}
