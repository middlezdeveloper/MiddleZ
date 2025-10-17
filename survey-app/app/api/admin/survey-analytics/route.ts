import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Temporarily bypass auth for testing
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    const where: any = {}
    if (projectId) {
      where.projectId = projectId
    }

    const responses = await prisma.surveyResponse.findMany({
      where,
      select: {
        experienceNPS: true,
        valueObjectivesDelivered: true,
        valueOrganisationCreated: true,
        capabilitySkillsBuilt: true,
        capabilityApplied: true,
        experienceSatisfaction: true,
        sustainabilityConfidence: true,
        sustainabilityReadiness: true,
        consentUseAsTestimonial: true,
        completedAt: true,
      },
    })

    const totalResponses = responses.length

    // Calculate NPS
    const promoters = totalResponses > 0 ? responses.filter((r) => r.experienceNPS >= 9).length : 0
    const passives = totalResponses > 0 ? responses.filter((r) => r.experienceNPS >= 7 && r.experienceNPS <= 8).length : 0
    const detractors = totalResponses > 0 ? responses.filter((r) => r.experienceNPS <= 6).length : 0

    const nps = totalResponses > 0
      ? Math.round(((promoters - detractors) / totalResponses) * 100)
      : 0

    // Calculate averages for HCD impact dimensions (handle division by zero)
    const avgValueObjectives = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.valueObjectivesDelivered, 0) / totalResponses
      : 0
    const avgValueOrganisation = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.valueOrganisationCreated, 0) / totalResponses
      : 0
    const avgCapabilitySkills = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.capabilitySkillsBuilt, 0) / totalResponses
      : 0
    const avgCapabilityApplied = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.capabilityApplied, 0) / totalResponses
      : 0
    const avgExperienceSatisfaction = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.experienceSatisfaction, 0) / totalResponses
      : 0
    const avgSustainabilityConfidence = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.sustainabilityConfidence, 0) / totalResponses
      : 0
    const avgSustainabilityReadiness = totalResponses > 0
      ? responses.reduce((sum, r) => sum + r.sustainabilityReadiness, 0) / totalResponses
      : 0

    // Aggregate dimensions
    const avgValueRealised = (avgValueObjectives + avgValueOrganisation) / 2
    const avgCapabilityUplift = (avgCapabilitySkills + avgCapabilityApplied) / 2
    const avgSustainability = (avgSustainabilityConfidence + avgSustainabilityReadiness) / 2

    // Testimonial consent stats
    const testimonialConsentCount = responses.filter((r) => r.consentUseAsTestimonial).length
    const testimonialConsentRate = totalResponses > 0
      ? Math.round((testimonialConsentCount / totalResponses) * 100)
      : 0

    // NPS trend over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentResponses = responses.filter(
      (r) => new Date(r.completedAt) >= thirtyDaysAgo
    )

    // Group by week
    const weeklyNPS: any[] = []
    const weeks = 4

    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(thirtyDaysAgo)
      weekStart.setDate(weekStart.getDate() + i * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      const weekResponses = recentResponses.filter(
        (r) => new Date(r.completedAt) >= weekStart && new Date(r.completedAt) < weekEnd
      )

      const weekPromoters = weekResponses.filter((r) => r.experienceNPS >= 9).length
      const weekDetractors = weekResponses.filter((r) => r.experienceNPS <= 6).length
      const weekTotal = weekResponses.length

      const weekNPS = weekTotal > 0
        ? Math.round(((weekPromoters - weekDetractors) / weekTotal) * 100)
        : 0

      weeklyNPS.push({
        week: `Week ${i + 1}`,
        nps: weekNPS,
        responses: weekTotal,
      })
    }

    return NextResponse.json({
      overview: {
        totalResponses,
        nps,
        npsBreakdown: {
          promoters,
          passives,
          detractors,
        },
        testimonialConsentRate,
        testimonialConsentCount,
      },
      impactDimensions: {
        valueRealised: avgValueRealised,
        capabilityUplift: avgCapabilityUplift,
        experienceQuality: avgExperienceSatisfaction,
        sustainability: avgSustainability,
      },
      detailedMetrics: {
        value: {
          objectivesDelivered: avgValueObjectives,
          organisationValue: avgValueOrganisation,
        },
        capability: {
          skillsBuilt: avgCapabilitySkills,
          applied: avgCapabilityApplied,
        },
        sustainability: {
          confidence: avgSustainabilityConfidence,
          readiness: avgSustainabilityReadiness,
        },
      },
      npsTrend: weeklyNPS,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
