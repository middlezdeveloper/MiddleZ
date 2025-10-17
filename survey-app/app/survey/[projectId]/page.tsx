'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { surveySchema, type SurveyFormData, attributionPreferences, usagePermissionOptions } from '@/lib/validations/survey'
import { SurveyProgress } from '@/components/survey/survey-progress'
import { StarRating } from '@/components/survey/star-rating'
import { NPSScale } from '@/components/survey/nps-scale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

const TOTAL_STEPS = 9

export default function SurveyPage() {
  const params = useParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [projectInfo, setProjectInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      isAnonymous: false,
      privacyPolicyAccepted: false,
      consentToFeedback: true,
      consentUseAsTestimonial: false,
      testimonialReleaseAccepted: false,
      usagePermissions: [],
    },
  })

  // Watch form values for conditional rendering
  const watchIsAnonymous = watch('isAnonymous')
  const watchPrivacyAccepted = watch('privacyPolicyAccepted')
  const watchTestimonialConsent = watch('consentUseAsTestimonial')
  const watchValueObjectives = watch('valueObjectivesDelivered')
  const watchValueOrganisation = watch('valueOrganisationCreated')
  const watchCapabilitySkills = watch('capabilitySkillsBuilt')
  const watchCapabilityApplied = watch('capabilityApplied')
  const watchExperienceSatisfaction = watch('experienceSatisfaction')
  const watchExperienceNPS = watch('experienceNPS')
  const watchSustainabilityConfidence = watch('sustainabilityConfidence')
  const watchSustainabilityReadiness = watch('sustainabilityReadiness')
  const watchUsagePermissions = watch('usagePermissions') || []

  // Fetch project info
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/survey/project/${params.projectId}`)
        if (res.ok) {
          const data = await res.json()
          setProjectInfo(data)
        }
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProject()
  }, [params.projectId])

  // Auto-save to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(`survey_${params.projectId}`, JSON.stringify(data))
    })
    return () => subscription.unsubscribe()
  }, [watch, params.projectId])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`survey_${params.projectId}`)
    if (saved) {
      const data = JSON.parse(saved)
      Object.keys(data).forEach((key) => {
        setValue(key as any, data[key])
      })
    }
  }, [params.projectId, setValue])

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const nextStep = async () => {
    let fieldsToValidate: any[] = []

    switch (currentStep) {
      case 1:
        // Welcome page - no required fields
        fieldsToValidate = []
        break
      case 2:
        // Your Information - privacy checkboxes required
        fieldsToValidate = ['privacyPolicyAccepted']
        break
      case 3:
        // Value Realised
        fieldsToValidate = ['valueObjectivesDelivered', 'valueOrganisationCreated']
        break
      case 4:
        // Capability Uplift
        fieldsToValidate = ['capabilitySkillsBuilt', 'capabilityApplied']
        break
      case 5:
        // Experience Quality
        fieldsToValidate = ['experienceSatisfaction', 'experienceNPS']
        break
      case 6:
        // Sustainability
        fieldsToValidate = ['sustainabilityConfidence', 'sustainabilityReadiness']
        break
      case 7:
        // Improvement Insights - no required fields
        fieldsToValidate = []
        break
    }

    const isValid = fieldsToValidate.length === 0 || await trigger(fieldsToValidate as any)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: SurveyFormData) => {
    setIsSubmitting(true)
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    try {
      const res = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          projectId: params.projectId,
          timeTakenSeconds: timeTaken,
        }),
      })

      if (res.ok) {
        localStorage.removeItem(`survey_${params.projectId}`)
        setCurrentStep(TOTAL_STEPS)
      } else {
        const error = await res.json()
        alert(`Error submitting survey: ${error.message}`)
      }
    } catch (error) {
      alert('Error submitting survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!projectInfo && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Survey Not Found</h1>
          <p className="text-gray-600">This survey link is invalid or has been deactivated.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Middle Z Logo */}
        <div className="text-center mb-8">
          <img
            src="/MiddleZ_logo-removebg-preview.png"
            alt="Middle Z"
            className="h-12 mx-auto mb-4"
          />
        </div>

        {currentStep < TOTAL_STEPS && (
          <div className="mb-8">
            <SurveyProgress currentStep={currentStep} totalSteps={TOTAL_STEPS - 1} />
          </div>
        )}

        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-4">Middle Z Impact Survey</h1>
                  <p className="text-gray-600 mb-2">Thank you for participating in our survey for the following project:</p>
                  <h2 className="text-2xl font-bold text-[#8a3cde] mb-6">{projectInfo?.projectName}</h2>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">About Middle Z</h3>
                  <p className="text-sm text-gray-700">
                    At Middle Z, we're a <strong>human-centered design agency</strong> committed to creating meaningful change through collaborative engagement. Understanding the real impact of our work—not just what we delivered, but how it felt, what shifted, and what difference it made—is essential to how we learn and grow.
                  </p>
                </div>

                <div className="bg-[#11ba81]/10 border border-[#11ba81]/30 rounded-lg p-6 space-y-4">
                  <h2 className="font-semibold text-lg">About This Survey</h2>
                  <p className="text-sm text-gray-700">
                    This survey uses a <strong>human-centered impact framework</strong> to measure what truly matters: value created, capabilities built, experience quality, sustainability, and continuous improvement.
                  </p>
                  <p className="text-sm text-gray-700">
                    We invite <strong>storytelling over data recall</strong>—your authentic stories and reflections help us understand the real impact of our work together.
                  </p>
                  <p className="text-sm text-gray-700">
                    You'll reflect on five key dimensions:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-2 list-none">
                    <li><strong>Value Realised:</strong> What tangible results were achieved?</li>
                    <li><strong>Capability Uplift:</strong> What new strengths did you build?</li>
                    <li><strong>Experience Quality:</strong> How did our collaboration feel?</li>
                    <li><strong>Sustainability:</strong> Will the impact continue beyond our engagement?</li>
                    <li><strong>Improvement Insights:</strong> How can we co-create better experiences?</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Your Participation</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Time required:</strong> Approximately 10-15 minutes</p>
                    <p><strong>Your privacy:</strong> All responses are confidential. You choose:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Whether to share your name and organization</li>
                      <li>Whether we may use your feedback as testimonials</li>
                      <li>How you would like to be attributed (from full name to completely anonymous)</li>
                    </ul>
                    <p><strong>Your honesty:</strong> We value authentic feedback—both what worked well and what could be better. There are no wrong answers, only your truth.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Your Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Information</h2>
                  <p className="text-gray-600">You can provide your details or submit anonymously</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label>Your name</Label>
                      <Input
                        {...register('respondentName')}
                        placeholder="Your name"
                        disabled={watchIsAnonymous}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Your email</Label>
                      <Input
                        {...register('respondentEmail')}
                        type="email"
                        placeholder="Your email"
                        disabled={watchIsAnonymous}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Your organization</Label>
                      <Input
                        {...register('respondentOrganization')}
                        placeholder="Your organization"
                        disabled={watchIsAnonymous}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        checked={watchIsAnonymous}
                        onCheckedChange={(checked) => setValue('isAnonymous', checked as boolean)}
                      />
                      <label className="text-sm">Submit anonymously</label>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        checked={watchPrivacyAccepted}
                        onCheckedChange={(checked) => setValue('privacyPolicyAccepted', checked as boolean)}
                      />
                      <label className="text-sm">
                        I have read and agree to the{' '}
                        <a href="/privacy" target="_blank" className="text-[#8a3cde] underline">
                          Privacy Policy
                        </a>
                        {errors.privacyPolicyAccepted && (
                          <span className="text-red-600 block mt-1">{errors.privacyPolicyAccepted.message}</span>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Value Realised */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Value Realised</h2>
                  <p className="text-gray-600 italic">Tell us about the tangible value created</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>To what extent did the engagement deliver on its stated objectives?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchValueObjectives}
                        onChange={(value) => setValue('valueObjectivesDelivered', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>How much value do you believe was created for your organisation?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchValueOrganisation}
                        onChange={(value) => setValue('valueOrganisationCreated', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Estimate of financial or operational improvement (if applicable)</Label>
                    <Input
                      {...register('valueFinancialEstimate')}
                      className="mt-2"
                      placeholder="e.g., 15% efficiency gain, $50K cost savings, etc."
                    />
                  </div>

                  <div>
                    <Label>What tangible changes have you seen since the engagement?</Label>
                    <Textarea
                      {...register('valueTangibleChanges')}
                      rows={4}
                      className="mt-2"
                      placeholder="Tell us about a moment when you noticed something had shifted..."
                    />
                  </div>

                  <div>
                    <Label>Which of our recommendations or interventions had the biggest impact?</Label>
                    <Textarea
                      {...register('valueBiggestImpact')}
                      rows={4}
                      className="mt-2"
                      placeholder="Share the specific recommendation that made the most difference..."
                    />
                  </div>

                  <div>
                    <Label>In your view, what results can be directly attributed to this work?</Label>
                    <Textarea
                      {...register('valueDirectAttribution')}
                      rows={4}
                      className="mt-2"
                      placeholder="What outcomes happened because of this engagement..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Capability Uplift */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Capability Uplift</h2>
                  <p className="text-gray-600 italic">Empowerment, not dependency—what strengths were built?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>To what extent did this engagement build your team's skills or confidence?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchCapabilitySkills}
                        onChange={(value) => setValue('capabilitySkillsBuilt', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>To what extent are these new capabilities being applied?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchCapabilityApplied}
                        onChange={(value) => setValue('capabilityApplied', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>What's one thing you or your team can now do that you couldn't before?</Label>
                    <Textarea
                      {...register('capabilityNewAbility')}
                      rows={4}
                      className="mt-2"
                      placeholder="Tell us about a new skill or confidence you've gained..."
                    />
                  </div>

                  <div>
                    <Label>What internal strengths have been built as a result?</Label>
                    <Textarea
                      {...register('capabilityInternalStrengths')}
                      rows={4}
                      className="mt-2"
                      placeholder="Share how your team has grown stronger..."
                    />
                  </div>

                  <div>
                    <Label>How might we better support you in sustaining or deepening these capabilities?</Label>
                    <Textarea
                      {...register('capabilitySupportNeeded')}
                      rows={4}
                      className="mt-2"
                      placeholder="What would help you continue building on this foundation..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Experience Quality */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Experience Quality</h2>
                  <p className="text-gray-600 italic">Mapping your journey—moments of delight, friction, and trust</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>How satisfied were you with our overall collaboration?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchExperienceSatisfaction}
                        onChange={(value) => setValue('experienceSatisfaction', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg">How likely are you to recommend working with us to a colleague?</Label>
                    <div className="mt-4">
                      <NPSScale
                        value={watchExperienceNPS ?? null}
                        onChange={(value) => setValue('experienceNPS', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>What is the primary reason for your score?</Label>
                    <Textarea
                      {...register('experienceNPSReason')}
                      rows={4}
                      className="mt-2"
                      placeholder="What drove your rating..."
                    />
                  </div>

                  <div>
                    <Label>What part of the experience felt most valuable or memorable?</Label>
                    <Textarea
                      {...register('experienceMostValuable')}
                      rows={4}
                      className="mt-2"
                      placeholder="Tell us about a moment that stood out to you..."
                    />
                  </div>

                  <div>
                    <Label>What could have made the process smoother, more engaging, or more inspiring?</Label>
                    <Textarea
                      {...register('experienceCouldImprove')}
                      rows={4}
                      className="mt-2"
                      placeholder="Share what could have been better..."
                    />
                  </div>

                  <div>
                    <Label>If you could change one thing about how we worked together, what would it be?</Label>
                    <Textarea
                      {...register('experienceChangeOne')}
                      rows={4}
                      className="mt-2"
                      placeholder="One thing you'd change..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Sustainability & Future Impact */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Sustainability & Future Impact</h2>
                  <p className="text-gray-600 italic">Co-ownership beyond delivery—what do we need to design for next?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>How confident are you that the results of this engagement will be sustained?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchSustainabilityConfidence}
                        onChange={(value) => setValue('sustainabilityConfidence', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>How ready do you feel to continue the work independently?</Label>
                    <div className="mt-3">
                      <StarRating
                        value={watchSustainabilityReadiness}
                        onChange={(value) => setValue('sustainabilityReadiness', value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>What do you need to keep the momentum going?</Label>
                    <Textarea
                      {...register('sustainabilityMomentumNeeds')}
                      rows={4}
                      className="mt-2"
                      placeholder="Tell us what would help you maintain the progress..."
                    />
                  </div>

                  <div>
                    <Label>What potential barriers might limit continued success?</Label>
                    <Textarea
                      {...register('sustainabilityBarriers')}
                      rows={4}
                      className="mt-2"
                      placeholder="Share any challenges you foresee..."
                    />
                  </div>

                  <div>
                    <Label>How could we help you amplify the impact further over time?</Label>
                    <Textarea
                      {...register('sustainabilityAmplifyImpact')}
                      rows={4}
                      className="mt-2"
                      placeholder="What additional support would multiply the results..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Improvement Insights */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Improvement Insights</h2>
                  <p className="text-gray-600 italic">You're now a co-designer—help us improve the experience</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>What would you like to see done differently in future engagements?</Label>
                    <Textarea
                      {...register('improvementFutureDifferently')}
                      rows={5}
                      className="mt-2"
                      placeholder="Share your honest feedback on what we should change..."
                    />
                  </div>

                  <div>
                    <Label>What could we do to make our collaboration even more impactful?</Label>
                    <Textarea
                      {...register('improvementMoreImpactful')}
                      rows={5}
                      className="mt-2"
                      placeholder="Tell us how we could amplify the value we create together..."
                    />
                  </div>

                  <div>
                    <Label>Any other reflections, stories, or feedback you'd like to share?</Label>
                    <Textarea
                      {...register('improvementOtherReflections')}
                      rows={5}
                      className="mt-2"
                      placeholder="Anything else on your mind..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Testimonial Consent */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Testimonial Consent</h2>
                  <p className="text-gray-600">
                    With your permission, we may use your feedback as testimonials on our website, in proposals,
                    and in other marketing materials.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watchTestimonialConsent}
                      onCheckedChange={(checked) => setValue('consentUseAsTestimonial', checked as boolean)}
                    />
                    <label className="text-sm font-medium">
                      May we use your feedback as a testimonial?
                    </label>
                  </div>

                  {watchTestimonialConsent && (
                    <>
                      <div>
                        <Label>How would you like to be attributed?</Label>
                        <RadioGroup
                          value={watch('attributionPreference') || ''}
                          onValueChange={(value) => setValue('attributionPreference', value as any)}
                          className="mt-3 space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="attr-full" />
                            <Label htmlFor="attr-full">Full attribution (Name, Role, Company)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="name_role" id="attr-name-role" />
                            <Label htmlFor="attr-name-role">Name + Role only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="role_company" id="attr-role-company" />
                            <Label htmlFor="attr-role-company">Role + Company only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="role_only" id="attr-role" />
                            <Label htmlFor="attr-role">Role only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="company_only" id="attr-company" />
                            <Label htmlFor="attr-company">Company only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="first_name_only" id="attr-first" />
                            <Label htmlFor="attr-first">First name only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="industry_only" id="attr-industry" />
                            <Label htmlFor="attr-industry">Industry only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="anonymous" id="attr-anon" />
                            <Label htmlFor="attr-anon">Completely anonymous</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Usage permissions (select all that apply):</Label>
                        <div className="mt-3 space-y-2">
                          {/* Select All Option */}
                          <div className="flex items-center space-x-2 pb-2 border-b">
                            <Checkbox
                              checked={watchUsagePermissions.length === usagePermissionOptions.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setValue('usagePermissions', [...usagePermissionOptions])
                                } else {
                                  setValue('usagePermissions', [])
                                }
                              }}
                            />
                            <label className="text-sm font-semibold">Select All</label>
                          </div>

                          {usagePermissionOptions.map((permission) => {
                            const isChecked = watchUsagePermissions.includes(permission)
                            return (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const current = watchUsagePermissions
                                    if (checked) {
                                      setValue('usagePermissions', [...current, permission])
                                    } else {
                                      setValue('usagePermissions', current.filter((p: string) => p !== permission))
                                    }
                                  }}
                                />
                                <label className="text-sm">
                                  {permission.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <Label>Sensitive information to exclude:</Label>
                        <Textarea
                          {...register('commerciallySensitiveNotes')}
                          rows={3}
                          className="mt-2"
                          placeholder="Any specific details that should not be shared publicly..."
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 bg-[#11ba81]/10 border border-[#11ba81]/30 p-4 rounded-lg">
                          <Checkbox
                            checked={watch('testimonialReleaseAccepted')}
                            onCheckedChange={(checked) => setValue('testimonialReleaseAccepted', checked as boolean)}
                          />
                          <label className="text-sm">
                            I accept the testimonial release and grant permission for the uses selected above <span className="text-red-600">*</span>
                          </label>
                        </div>
                        {errors.testimonialReleaseAccepted && (
                          <p className="text-red-600 text-sm">{errors.testimonialReleaseAccepted.message}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 9: Thank You */}
            {currentStep === 9 && (
              <div className="space-y-6 text-center">
                <div className="text-6xl">🙏</div>
                <h2 className="text-3xl font-bold">Thank You!</h2>
                <p className="text-lg text-gray-700">
                  Your feedback has been successfully submitted. We deeply value your insights and time.
                </p>
                <p className="text-gray-600">
                  Your responses will help us continuously improve our services and better serve our clients.
                </p>
                <div className="pt-4 text-sm text-gray-500">
                  <p>Questions? Contact us at hello@middlez.com.au</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < TOTAL_STEPS && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                {currentStep < 8 && (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {currentStep === 8 && (
                  <Button type="submit" disabled={isSubmitting} className="ml-auto">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Survey'
                    )}
                  </Button>
                )}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}
