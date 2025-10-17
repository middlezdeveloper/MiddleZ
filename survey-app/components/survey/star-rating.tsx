'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number | undefined
  onChange: (value: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1
        const isActive = value !== undefined && starValue <= value

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                'w-8 h-8 transition-colors',
                isActive
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300 hover:text-gray-400'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
