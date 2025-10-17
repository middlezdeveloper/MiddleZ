'use client'

import { cn } from '@/lib/utils'

interface NPSScaleProps {
  value: number | null
  onChange: (value: number) => void
}

export function NPSScale({ value, onChange }: NPSScaleProps) {
  const getButtonColor = (score: number) => {
    if (score <= 6) return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300'
    if (score <= 8) return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300'
    return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-11 gap-2">
        {Array.from({ length: 11 }).map((_, index) => {
          const isActive = value === index

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(index)}
              className={cn(
                'h-12 rounded-lg border-2 font-semibold transition-all',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                isActive
                  ? 'scale-110 shadow-lg ring-2 ring-blue-500'
                  : 'hover:scale-105',
                getButtonColor(index)
              )}
              aria-label={`Score ${index}`}
            >
              {index}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Not at all likely</span>
        <span>Extremely likely</span>
      </div>
      {value !== null && (
        <div className="text-center text-sm font-medium text-gray-700">
          {value <= 6 && 'Detractor'}
          {value >= 7 && value <= 8 && 'Passive'}
          {value >= 9 && 'Promoter'}
        </div>
      )}
    </div>
  )
}
