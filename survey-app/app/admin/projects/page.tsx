'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Copy, CheckCircle, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    projectName: '',
    sowNumber: '',
    clientName: '',
    engagementDate: '',
    engagementType: '',
  })

  useEffect(() => {
    // Temporarily bypass auth for testing
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/generate-link', {
        headers: {
          'x-admin-password': 'MiddleZ2024!'
        }
      })
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/admin/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': 'MiddleZ2024!'
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setProjects([
          {
            ...data.project,
            surveyUrl: data.surveyUrl,
            responseCount: 0,
            createdAt: new Date(),
            isActive: true,
          },
          ...projects,
        ])
        setFormData({
          projectName: '',
          sowNumber: '',
          clientName: '',
          engagementDate: '',
          engagementType: '',
        })
        setShowForm(false)

        // Auto-copy the new link
        await navigator.clipboard.writeText(data.surveyUrl)
        setCopiedId(data.project.id)
        setTimeout(() => setCopiedId(null), 3000)
      } else {
        const error = await res.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert('Error creating project')
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Survey Projects</h1>
            <p className="text-gray-600 mt-1">
              Create projects and generate survey links to share with clients
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline">← Dashboard</Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? 'Cancel' : 'New Project'}
            </Button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Create New Survey Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">
                    Project Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) =>
                      setFormData({ ...formData, projectName: e.target.value })
                    }
                    placeholder="e.g., Digital Transformation Strategy"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sowNumber">
                    SOW Number <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="sowNumber"
                    value={formData.sowNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, sowNumber: e.target.value })
                    }
                    placeholder="e.g., SOW-2024-001"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be used in the survey URL
                  </p>
                </div>
                <div>
                  <Label htmlFor="clientName">Client/Organization Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="e.g., Acme Corporation"
                  />
                </div>
                <div>
                  <Label htmlFor="engagementDate">Engagement Date</Label>
                  <Input
                    id="engagementDate"
                    type="date"
                    value={formData.engagementDate}
                    onChange={(e) =>
                      setFormData({ ...formData, engagementDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="engagementType">Engagement Type</Label>
                  <Input
                    id="engagementType"
                    value={formData.engagementType}
                    onChange={(e) =>
                      setFormData({ ...formData, engagementType: e.target.value })
                    }
                    placeholder="e.g., Strategic Consulting, Workshop"
                  />
                </div>
              </div>
              <Button type="submit" disabled={creating} className="w-full">
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Generate Survey Link'
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Projects List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">All Projects</h2>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">No projects yet. Create your first survey project!</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{project.projectName}</h3>
                        {project.sowNumber && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-mono rounded">
                            {project.sowNumber}
                          </span>
                        )}
                      </div>
                      {project.clientName && (
                        <p className="text-sm text-gray-600">{project.clientName}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {project.engagementType && (
                          <span>Type: {project.engagementType}</span>
                        )}
                        {project.engagementDate && (
                          <span>
                            Date: {new Date(project.engagementDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>Responses: {project.responseCount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin?project=${project.id}`}>
                        <Button variant="outline" size="sm">
                          View Analytics
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 flex items-center gap-2">
                    <code className="flex-1 text-sm text-gray-700 truncate">
                      {project.surveyUrl}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(project.surveyUrl, project.id)}
                    >
                      {copiedId === project.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <a
                      href={project.surveyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        project.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {project.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm text-gray-400">
                      • Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Info Box */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2">📋 How to use survey links</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Each project can receive <strong>unlimited responses</strong></li>
            <li>• Share the same link with multiple stakeholders at the client organization</li>
            <li>• View aggregated analytics for all responses to a project</li>
            <li>• Each person who completes the survey creates a separate response</li>
            <li>• Analytics automatically combine all responses per project</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
