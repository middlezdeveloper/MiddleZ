import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const projectSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  sowNumber: z.string().min(1, 'SOW number is required'),
  clientName: z.string().optional(),
  engagementDate: z.string().optional(),
  engagementType: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Check admin password
    const authHeader = req.headers.get('x-admin-password')
    if (authHeader !== 'MiddleZ2024!') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validated = projectSchema.parse(body)

    // Create URL-friendly ID from SOW number
    const projectId = validated.sowNumber
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Create project
    const project = await prisma.surveyProject.create({
      data: {
        id: projectId,
        projectName: validated.projectName,
        sowNumber: validated.sowNumber,
        clientName: validated.clientName,
        engagementDate: validated.engagementDate ? new Date(validated.engagementDate) : null,
        engagementType: validated.engagementType,
        isActive: true,
      },
    })

    // Generate full URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const surveyUrl = `${baseUrl}/survey/${project.id}`

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        projectName: project.projectName,
        sowNumber: project.sowNumber,
        clientName: project.clientName,
      },
      surveyUrl,
    })
  } catch (error: any) {
    console.error('Error generating link:', error)

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
        message: 'Failed to generate survey link',
        error: error.message,
      },
      { status: 500 }
    )
  }
}

// Get all projects
export async function GET(req: NextRequest) {
  try {
    // Check admin password
    const authHeader = req.headers.get('x-admin-password')
    if (authHeader !== 'MiddleZ2024!') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const projects = await prisma.surveyProject.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const projectsWithUrls = projects.map((project) => ({
      id: project.id,
      projectName: project.projectName,
      sowNumber: project.sowNumber,
      clientName: project.clientName,
      engagementDate: project.engagementDate,
      engagementType: project.engagementType,
      isActive: project.isActive,
      createdAt: project.createdAt,
      responseCount: project._count.responses,
      surveyUrl: `${baseUrl}/survey/${project.id}`,
    }))

    return NextResponse.json({
      projects: projectsWithUrls,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// Delete project
export async function DELETE(req: NextRequest) {
  try {
    // Check admin password
    const authHeader = req.headers.get('x-admin-password')
    if (authHeader !== 'MiddleZ2024!') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Delete project (cascade will delete all responses)
    await prisma.surveyProject.delete({
      where: { id: projectId },
    })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
