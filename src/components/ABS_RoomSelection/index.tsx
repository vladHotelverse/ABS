import React from 'react'

export interface RoomSelectionProps {
  title: string
  description: string
  url: string
  iframe?: {
    width: string
    height: string
    frameBorder: number
    allowFullScreen: boolean
    title: string
  }
  className?: string
}

export const ABS_RoomSelection: React.FC<RoomSelectionProps> = ({
  title,
  description,
  url,
  iframe = {
    width: '100%',
    height: '400px',
    frameBorder: 0,
    allowFullScreen: true,
    title: 'Choose your room number - Interactive Hotel Map',
  },
  className = '',
}) => {
  return (
    <section className={`w-full ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {description}
          </p>
        </div>
        
        <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <iframe
            src={url}
            width={iframe.width}
            height={iframe.height}
            frameBorder={iframe.frameBorder}
            allowFullScreen={iframe.allowFullScreen}
            title={iframe.title}
            className="w-full"
            style={{ minHeight: iframe.height }}
          />
        </div>
      </div>
    </section>
  )
}

export default ABS_RoomSelection