import type React from 'react'
import { useEffect, useRef, useState } from 'react'

interface HotelBannerProps {
  hotelImage?: string
  welcomeText?: {
    salutation: string
    greeting: string
  }
}

const HotelBanner: React.FC<HotelBannerProps> = ({ hotelImage, welcomeText }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsLoading(true)
    setImageError(false)
  }, [hotelImage])

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false)
    }
  }, [hotelImage])

  return (
    <section className="rounded-lg bg-card shadow-depth-1">
      <div className="relative mx-auto h-40 w-full overflow-hidden">
        {/* Hotel Image */}
        {!imageError && (
          <img
            ref={imgRef}
            src={hotelImage}
            alt="Hotel exterior view"
            className="absolute inset-0 h-full w-full rounded-t-lg object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Overlay mask for text visibility */}
        {welcomeText && <div className="absolute inset-0 rounded-lg bg-black/30" />}

        {/* Loading State */}
        {isLoading && !imageError && (
          <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-t-lg bg-gray-200">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}

        {/* Welcome Message - Clean Simple Design */}
        {welcomeText && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="text-center">
              <h4 className="mt-2 font-bold text-3xl text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                {welcomeText.greeting}
              </h4>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default HotelBanner
