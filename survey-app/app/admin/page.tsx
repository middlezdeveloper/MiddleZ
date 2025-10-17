'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Copy, CheckCircle, Plus, ExternalLink, BarChart3, ListIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

type View = 'projects' | 'analytics'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [view, setView] = useState<View>('projects')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Projects state
  const [projects, setProjects] = useState<any[]>([])
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

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null)
  const [responses, setResponses] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/generate-link')
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

  const fetchAnalytics = async (projectId: string) => {
    setLoading(true)
    try {
      const analyticsUrl = `/api/admin/survey-analytics?projectId=${projectId}`
      const responsesUrl = `/api/admin/survey-responses?limit=10&projectId=${projectId}`

      const [analyticsRes, responsesRes] = await Promise.all([
        fetch(analyticsUrl),
        fetch(responsesUrl),
      ])

      if (analyticsRes.ok && responsesRes.ok) {
        const analyticsData = await analyticsRes.json()
        const responsesData = await responsesRes.json()
        setAnalytics(analyticsData)
        setResponses(responsesData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        const newProject = {
          ...data.project,
          surveyUrl: data.surveyUrl,
          responseCount: 0,
          createdAt: new Date(),
          isActive: true,
        }
        setProjects([newProject, ...projects])
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
        alert(`Error: ${error.message || 'Failed to create project'}`)
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

  const viewProjectAnalytics = (projectId: string) => {
    setSelectedProjectId(projectId)
    setView('analytics')
    fetchAnalytics(projectId)
  }

  useEffect(() => {
    // Check if already authenticated in session
    const authenticated = sessionStorage.getItem('admin_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
      fetchProjects()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Change this password to whatever you want
    if (password === 'MiddleZ2024!') {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_authenticated', 'true')
      setLoginError('')
      fetchProjects()
    } else {
      setLoginError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <img
              src="/MiddleZ_logo-removebg-preview.png"
              alt="Middle Z"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm">{loginError}</p>
            )}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  if (loading && view === 'analytics') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <img
            src="/MiddleZ_logo-removebg-preview.png"
            alt="Middle Z"
            className="h-12 mx-auto"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage survey projects and view analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'projects' ? 'default' : 'outline'}
              onClick={() => setView('projects')}
            >
              <ListIcon className="w-4 h-4 mr-2" />
              Projects
            </Button>
            {selectedProjectId && (
              <Button
                variant={view === 'analytics' ? 'default' : 'outline'}
                onClick={() => {
                  setView('analytics')
                  fetchAnalytics(selectedProjectId)
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Projects View */}
        {view === 'projects' && (
          <div className="space-y-6">
            {/* Create Form Toggle */}
            <div className="flex justify-end">
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? 'Cancel' : 'New Project'}
              </Button>
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
                        Used in survey URL (e.g., /survey/sow-2024-001)
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
                    <div className="md:col-span-2">
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

              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                </div>
              ) : projects.length === 0 ? (
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewProjectAnalytics(project.id)}
                          >
                            <BarChart3 className="w-4 h-4 mr-1" />
                            View Analytics
                          </Button>
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
                              Copy
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
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && selectedProjectId && (
          <AnalyticsView
            analytics={analytics}
            responses={responses}
            projectId={selectedProjectId}
            onBack={() => setView('projects')}
          />
        )}
      </div>
    </div>
  )
}

// Analytics Component
function AnalyticsView({ analytics, responses, projectId, onBack }: any) {
  if (!analytics || !responses) {
    return (
      <div className="text-center py-12">
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-4">
            There are no survey responses yet for this project.
          </p>
          <Button onClick={onBack}>Back to Projects</Button>
        </Card>
      </div>
    )
  }

  const impactDimensionsData = [
    { name: 'Value Realised', value: analytics.impactDimensions.valueRealised },
    { name: 'Capability Uplift', value: analytics.impactDimensions.capabilityUplift },
    { name: 'Experience Quality', value: analytics.impactDimensions.experienceQuality },
    { name: 'Sustainability', value: analytics.impactDimensions.sustainability },
  ]

  const npsBreakdownData = [
    { name: 'Promoters', value: analytics.overview.npsBreakdown.promoters, color: '#10b981' },
    { name: 'Passives', value: analytics.overview.npsBreakdown.passives, color: '#f59e0b' },
    { name: 'Detractors', value: analytics.overview.npsBreakdown.detractors, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        ← Back to Projects
      </Button>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Responses</p>
          <p className="text-3xl font-bold mt-2">{analytics.overview.totalResponses}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Net Promoter Score</p>
          <p className={`text-3xl font-bold mt-2 ${analytics.overview.nps >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.overview.nps}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Promoters</p>
          <p className="text-3xl font-bold mt-2 text-green-600">{analytics.overview.npsBreakdown.promoters}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Testimonial Consent</p>
          <p className="text-3xl font-bold mt-2">{analytics.overview.testimonialConsentRate}%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">HCD Impact Dimensions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactDimensionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8a3cde" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">NPS Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={npsBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {npsBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">NPS Trend (Last 4 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.npsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[-100, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="nps" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Responses */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Responses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Respondent</th>
                <th className="text-left p-3">NPS</th>
                <th className="text-left p-3">Satisfaction</th>
                <th className="text-left p-3">Testimonial</th>
              </tr>
            </thead>
            <tbody>
              {responses.responses.map((response: any) => (
                <tr key={response.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(response.completedAt).toLocaleDateString()}</td>
                  <td className="p-3">{response.isAnonymous ? 'Anonymous' : response.respondentName || 'N/A'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        response.experienceNPS >= 9
                          ? 'bg-green-100 text-green-800'
                          : response.experienceNPS >= 7
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {response.experienceNPS}
                    </span>
                  </td>
                  <td className="p-3">{response.experienceSatisfaction}/5</td>
                  <td className="p-3">{response.consentUseAsTestimonial ? '✓ Yes' : '✗ No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
