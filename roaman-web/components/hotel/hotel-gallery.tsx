"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface HotelGalleryProps {
  images: string[]
  hotelName: string
}

export function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const displayImages = images.length > 0 ? images : ["/hotel-room-interior.png"]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg overflow-hidden">
        <div
          className="aspect-[4/3] relative cursor-pointer"
          onClick={() => {
            setCurrentIndex(0)
            setLightboxOpen(true)
          }}
        >
          <Image
            src={displayImages[0] || "/placeholder.svg"}
            alt={`${hotelName} - Main`}
            fill
            className="object-cover hover:opacity-90 transition-opacity"
          />
        </div>
        {displayImages.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {displayImages.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="aspect-[4/3] relative cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index + 1)
                  setLightboxOpen(true)
                }}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${hotelName} - ${index + 2}`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity"
                />
                {index === 3 && displayImages.length > 5 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="text-lg font-medium">+{displayImages.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur">
          <div className="relative aspect-[16/10]">
            <Image
              src={displayImages[currentIndex] || "/placeholder.svg"}
              alt={`${hotelName} - ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {displayImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
