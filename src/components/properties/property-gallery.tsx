'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PropertyGallery({ images, title }: { images: { url: string }[]; title: string }) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        No images available
      </div>
    )
  }

  const prev = () => setIndex((index - 1 + images.length) % images.length)
  const next = () => setIndex((index + 1) % images.length)

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[index].url}
          alt={`${title} - image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-background/80 px-2 py-1 text-xs">
          {index + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === index ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} - thumbnail ${i + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
