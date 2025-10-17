'use client'

import { Progress } from '@/components/ui/progress'

interface SurveyProgressProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = [
  'Welcome',
  'Your Information',
  'Value Realised',
  'Capability',
  'Experience',
  'Sustainability',
  'Improvement',
  'Testimonial',
  'Complete',
]

export function SurveyProgress({ currentStep, totalSteps }: SurveyProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{stepLabels[currentStep - 1] || 'Survey'}</span>
        <span>Step {currentStep} of {totalSteps}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
