import { z } from 'zod'

export const attributionPreferences = [
  'full',
  'name_role',
  'role_company',
  'role_only',
  'company_only',
  'first_name_only',
  'industry_only',
  'anonymous',
] as const

export const usagePermissionOptions = [
  'edit_with_approval',
  'excerpt',
  'website',
  'proposals',
  'social_media',
  'case_studies',
  'reference_calls',
] as const

export const surveySchema = z.object({
  // Respondent info
  respondentName: z.string().optional(),
  respondentEmail: z.string().email().optional().or(z.literal('')),
  respondentOrganization: z.string().optional(),
  isAnonymous: z.boolean().default(false),

  // Privacy consent
  privacyPolicyAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  consentToFeedback: z.boolean().refine((val) => val === true, {
    message: 'You must consent to providing feedback',
  }),

  // A. Value Realised
  valueObjectivesDelivered: z.number().min(1).max(5),
  valueOrganisationCreated: z.number().min(1).max(5),
  valueFinancialEstimate: z.string().optional(),
  valueTangibleChanges: z.string().optional(),
  valueBiggestImpact: z.string().optional(),
  valueDirectAttribution: z.string().optional(),

  // B. Capability Uplift
  capabilitySkillsBuilt: z.number().min(1).max(5),
  capabilityApplied: z.number().min(1).max(5),
  capabilityNewAbility: z.string().optional(),
  capabilityInternalStrengths: z.string().optional(),
  capabilitySupportNeeded: z.string().optional(),

  // C. Experience Quality
  experienceSatisfaction: z.number().min(1).max(5),
  experienceNPS: z.number().min(0).max(10),
  experienceNPSReason: z.string().optional(),
  experienceMostValuable: z.string().optional(),
  experienceCouldImprove: z.string().optional(),
  experienceChangeOne: z.string().optional(),

  // D. Sustainability & Future Impact
  sustainabilityConfidence: z.number().min(1).max(5),
  sustainabilityReadiness: z.number().min(1).max(5),
  sustainabilityMomentumNeeds: z.string().optional(),
  sustainabilityBarriers: z.string().optional(),
  sustainabilityAmplifyImpact: z.string().optional(),

  // E. Improvement Insights
  improvementFutureDifferently: z.string().optional(),
  improvementMoreImpactful: z.string().optional(),
  improvementOtherReflections: z.string().optional(),

  // Testimonial Consent
  consentUseAsTestimonial: z.boolean().default(false),
  attributionPreference: z.enum(attributionPreferences).optional(),
  usagePermissions: z.array(z.enum(usagePermissionOptions)).optional(),
  commerciallySensitiveNotes: z.string().optional(),
  testimonialReleaseAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the testimonial release to submit',
  }),

  // Metadata
  timeTakenSeconds: z.number().optional(),
})

export type SurveyFormData = z.infer<typeof surveySchema>
