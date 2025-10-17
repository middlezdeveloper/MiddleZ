import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <img
            src="/MiddleZ_logo-removebg-preview.png"
            alt="Middle Z"
            className="h-16 mx-auto mb-6"
          />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Survey System
          </h1>
          <p className="text-xl text-gray-600">
            Human-centered consulting engagement assessment
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">About This System</h2>
          <p className="text-gray-700 mb-4">
            Our survey system uses the <strong>Kirkpatrick 4 Levels</strong> framework combined with{' '}
            <strong>Net Promoter Score</strong> to measure the impact and effectiveness of consulting engagements.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Kirkpatrick 4 Levels</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><strong>Level 1:</strong> Reaction - Immediate satisfaction</li>
                <li><strong>Level 2:</strong> Learning - New insights gained</li>
                <li><strong>Level 3:</strong> Behaviour - Application of learning</li>
                <li><strong>Level 4:</strong> Results - Tangible outcomes</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 9-step thoughtful survey flow</li>
                <li>✓ Anonymous submission option</li>
                <li>✓ Testimonial consent management</li>
                <li>✓ GDPR & APP compliant</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3">Take a Survey</h3>
            <p className="text-gray-600 mb-4">
              Have a survey link? Click below to access your personalized survey.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Survey links follow this format:<br />
              <code className="bg-gray-100 px-2 py-1 rounded">
                /survey/[project-id]
              </code>
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3">Admin Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Access analytics, view responses, and manage testimonials.
            </p>
            <Link href="/admin">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-3">Privacy & Compliance</h3>
          <p className="text-gray-600 mb-4">
            We take your privacy seriously. Our survey system is fully compliant with GDPR and
            Australian Privacy Principles (APPs).
          </p>
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Read our Privacy Policy →
          </Link>
        </Card>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2025 Middle Z Consulting. All rights reserved.</p>
          <p className="mt-2">
            For questions or support:{' '}
            <a href="mailto:privacy@middlez.com" className="text-blue-600 hover:underline">
              privacy@middlez.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
