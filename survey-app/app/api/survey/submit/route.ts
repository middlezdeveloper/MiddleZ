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
        valueObjectivesDelivered: validated.valueObjectivesDelivered,
        impactfulAspects: validated.impactfulAspects,
        challengesAddress: validated.challengesAddress,
        newInsightsGained: validated.newInsightsGained,
        shiftInThinking: validated.shiftInThinking,
        practicallyApplied: validated.practicallyApplied,
        realWorldImpactExample: validated.realWorldImpactExample,
        benefitsRealised: validated.benefitsRealised,
        tangibleOutcomes: validated.tangibleOutcomes,
        hcdNpsScore: validated.hcdNpsScore,
        hcdNpsReason: validated.hcdNpsReason,
        improvementSuggestions: validated.improvementSuggestions,
        oneWordReflection: validated.oneWordReflection,
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
