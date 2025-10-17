import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample projects
  const project1 = await prisma.surveyProject.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      projectName: 'Digital Transformation Strategy',
      clientName: 'Sample Organization',
      engagementDate: new Date('2024-01-15'),
      engagementType: 'Strategic Consulting',
      isActive: true,
    },
  })

  const project2 = await prisma.surveyProject.upsert({
    where: { id: 'sample-project-2' },
    update: {},
    create: {
      id: 'sample-project-2',
      projectName: 'Innovation Workshop Series',
      clientName: 'Tech Startup Co',
      engagementDate: new Date('2024-02-20'),
      engagementType: 'Workshop Facilitation',
      isActive: true,
    },
  })

  console.log('✅ Created sample projects:', {
    project1: project1.projectName,
    project2: project2.projectName,
  })

  // Create a sample survey response with HCD Impact Framework
  const sampleResponse = await prisma.surveyResponse.create({
    data: {
      projectId: project1.id,
      respondentName: 'Jane Smith',
      respondentEmail: 'jane.smith@example.com',
      respondentOrganization: 'Sample Organization',
      isAnonymous: false,
      privacyPolicyAccepted: true,
      consentToFeedback: true,

      // A. Value Realised
      valueObjectivesDelivered: 5,
      valueOrganisationCreated: 5,
      valueFinancialEstimate: '$500K in operational savings projected over 2 years',
      valueTangibleChanges: 'Developed a 3-year digital transformation roadmap and secured executive buy-in. We now have clear priorities and measurable milestones.',
      valueBiggestImpact: 'The strategic framework that helped us align leadership on a unified vision for digital transformation.',
      valueDirectAttribution: 'Executive approval of $2M innovation budget, formation of cross-functional transformation team, and adoption of agile methodologies.',

      // B. Capability Uplift
      capabilitySkillsBuilt: 5,
      capabilityApplied: 4,
      capabilityNewAbility: 'Our team can now facilitate design thinking workshops independently and apply human-centered principles to strategic planning.',
      capabilityInternalStrengths: 'Built confidence in our innovation capability, established a shared language for transformation, and created internal champions.',
      capabilitySupportNeeded: 'Ongoing coaching for our internal facilitators and quarterly check-ins to sustain momentum.',

      // C. Experience Quality
      experienceSatisfaction: 5,
      experienceNPS: 10,
      experienceNPSReason: 'Exceptional expertise, genuine partnership approach, and lasting impact on our organization.',
      experienceMostValuable: 'The collaborative approach and deep understanding of our industry challenges. You felt like part of our team.',
      experienceCouldImprove: 'Perhaps a few more touchpoints during implementation to address emerging questions.',
      experienceChangeOne: 'More regular check-ins during the 6-week implementation phase.',

      // D. Sustainability & Future Impact
      sustainabilityConfidence: 4,
      sustainabilityReadiness: 4,
      sustainabilityMomentumNeeds: 'Continued executive sponsorship, dedicated resources for implementation, and periodic reinforcement of the new practices.',
      sustainabilityBarriers: 'Potential resource constraints and competing priorities as business demands increase.',
      sustainabilityAmplifyImpact: 'Quarterly coaching sessions and access to a community of practice with other organizations on similar journeys.',

      // E. Improvement Insights
      improvementFutureDifferently: 'Perhaps more follow-up sessions to track implementation progress and address emerging challenges in real-time.',
      improvementMoreImpactful: 'Even deeper integration with our existing initiatives and more hands-on support during the first 90 days of implementation.',
      improvementOtherReflections: 'This has been truly transformative for our organization. The human-centered approach resonated deeply with our values.',

      // Testimonial consent
      consentUseAsTestimonial: true,
      attributionPreference: 'full',
      usagePermissions: [
        'website',
        'proposals',
        'case_studies',
        'reference_calls',
      ],
      testimonialReleaseAccepted: true,
      consentIpAddress: '127.0.0.1',
      timeTakenSeconds: 720,
    },
  })

  console.log('✅ Created sample response from:', sampleResponse.respondentName)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
