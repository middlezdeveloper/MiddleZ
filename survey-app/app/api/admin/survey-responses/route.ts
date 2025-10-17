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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const projectId = searchParams.get('projectId')
    const npsCategory = searchParams.get('npsCategory') // promoter, passive, detractor
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (projectId) {
      where.projectId = projectId
    }

    if (npsCategory === 'promoter') {
      where.experienceNPS = { gte: 9 }
    } else if (npsCategory === 'passive') {
      where.experienceNPS = { gte: 7, lte: 8 }
    } else if (npsCategory === 'detractor') {
      where.experienceNPS = { lte: 6 }
    }

    const [responses, total] = await Promise.all([
      prisma.surveyResponse.findMany({
        where,
        include: {
          project: {
            select: {
              projectName: true,
              clientName: true,
            },
          },
        },
        orderBy: {
          completedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.surveyResponse.count({ where }),
    ])

    return NextResponse.json({
      responses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
