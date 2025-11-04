import clsx from 'clsx'
import { ImageIcon } from 'lucide-react'
import type React from 'react'

export interface OfferImageProps {
  image?: string
  title: string
  className?: string
  // Label when image is not available (pre-formatted by parent/labels)
  noImageLabel: string
}

const OfferImage: React.FC<OfferImageProps> = ({ image, title, className, noImageLabel }) => (
  <div
    className={clsx(
      'flex items-center justify-center h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden',
      className
    )}
  >
    {image ? (
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    ) : (
      <div className="flex flex-col items-center justify-center text-neutral-400">
        <ImageIcon className="h-12 w-12 mb-2" />
        <span className="text-sm font-medium">{noImageLabel}</span>
      </div>
    )}
  </div>
)

export default OfferImage
