import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { surveySchema } from '@/lib/validations/survey'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectId, ...surveyData } = body

    // Validate project exists
    const project = await prisma.surveyProject.findUnique({
      where: { id: projectId },
    })

    if (!project || !project.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid or inactive project' },
        { status: 404 }
      )
    }

    // Validate survey data
    const validated = surveySchema.parse(surveyData)

    // Get client IP address
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'

    // Create survey response
    const response = await prisma.surveyResponse.create({
      data: {
        projectId,
        respondentName: validated.respondentName,
        respondentEmail: validated.respondentEmail,
        respondentOrganization: validated.respondentOrganization,
        isAnonymous: validated.isAnonymous,
        privacyPolicyAccepted: validated.privacyPolicyAccepted,
        consentToFeedback: validated.consentToFeedback,
        // A. Value Realised
        valueObjectivesDelivered: validated.valueObjectivesDelivered,
        valueOrganisationCreated: validated.valueOrganisationCreated,
        valueFinancialEstimate: validated.valueFinancialEstimate,
        valueTangibleChanges: validated.valueTangibleChanges,
        valueBiggestImpact: validated.valueBiggestImpact,
        valueDirectAttribution: validated.valueDirectAttribution,
        // B. Capability Uplift
        capabilitySkillsBuilt: validated.capabilitySkillsBuilt,
        capabilityApplied: validated.capabilityApplied,
        capabilityNewAbility: validated.capabilityNewAbility,
        capabilityInternalStrengths: validated.capabilityInternalStrengths,
        capabilitySupportNeeded: validated.capabilitySupportNeeded,
        // C. Experience Quality
        experienceSatisfaction: validated.experienceSatisfaction,
        experienceNPS: validated.experienceNPS,
        experienceNPSReason: validated.experienceNPSReason,
        experienceMostValuable: validated.experienceMostValuable,
        experienceCouldImprove: validated.experienceCouldImprove,
        experienceChangeOne: validated.experienceChangeOne,
        // D. Sustainability & Future Impact
        sustainabilityConfidence: validated.sustainabilityConfidence,
        sustainabilityReadiness: validated.sustainabilityReadiness,
        sustainabilityMomentumNeeds: validated.sustainabilityMomentumNeeds,
        sustainabilityBarriers: validated.sustainabilityBarriers,
        sustainabilityAmplifyImpact: validated.sustainabilityAmplifyImpact,
        // E. Improvement Insights
        improvementFutureDifferently: validated.improvementFutureDifferently,
        improvementMoreImpactful: validated.improvementMoreImpactful,
        improvementOtherReflections: validated.improvementOtherReflections,
        // Testimonial Consent
        consentUseAsTestimonial: validated.consentUseAsTestimonial,
        attributionPreference: validated.attributionPreference,
        usagePermissions: validated.usagePermissions || [],
        commerciallySensitiveNotes: validated.commerciallySensitiveNotes,
        testimonialReleaseAccepted: validated.testimonialReleaseAccepted,
        consentIpAddress: ip,
        timeTakenSeconds: validated.timeTakenSeconds,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Survey submitted successfully',
      responseId: response.id,
    })
  } catch (error: any) {
    console.error('Survey submission error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit survey',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
