import { Card } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: January 1, 2025</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
              <p>
                Middle Z ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you participate in our consulting engagement
                assessment surveys.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide</h3>
              <p>When you complete our survey, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (name, email address, organization) - optional</li>
                <li>Survey responses including satisfaction ratings, feedback, and testimonials</li>
                <li>Testimonial consent preferences and attribution choices</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address (for consent verification and security)</li>
                <li>Timestamp of survey completion</li>
                <li>Time taken to complete the survey</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Evaluate and improve our consulting services</li>
                <li>Understand the impact and effectiveness of our engagements</li>
                <li>Generate aggregated analytics and insights</li>
                <li>Display testimonials (only with your explicit consent and according to your attribution preferences)</li>
                <li>Respond to your feedback and suggestions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Testimonial Use</h2>
              <p>
                If you consent to testimonial use, we will only use your feedback in accordance with your specified
                attribution preferences and usage permissions. You have complete control over:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>How you are identified (full name, role, company, or anonymous)</li>
                <li>Where your testimonial may be used (website, proposals, social media, etc.)</li>
                <li>Whether we can edit for clarity (with your approval)</li>
                <li>What commercially sensitive information should be excluded</li>
              </ul>
              <p className="mt-4">
                You can withdraw your testimonial consent at any time by contacting us at{' '}
                <a href="mailto:privacy@middlez.com" className="text-blue-600 underline">
                  privacy@middlez.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Anonymous Submissions</h2>
              <p>
                You have the option to submit feedback anonymously. Anonymous submissions will not include any personally
                identifiable information. We will still collect IP addresses and timestamps for security and validation purposes,
                but these will not be linked to your identity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information. We may share your information only:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent (e.g., testimonials)</li>
                <li>To comply with legal obligations or protect our rights</li>
                <li>With service providers who assist in survey administration (under strict confidentiality agreements)</li>
                <li>In aggregated, non-identifiable form for research and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure database storage</li>
                <li>Access controls and authentication</li>
                <li>Regular security audits</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information,
                we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Data Retention</h2>
              <p>
                We retain survey responses for as long as necessary to fulfill the purposes outlined in this policy, unless
                a longer retention period is required by law. You may request deletion of your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of your survey responses</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw testimonial consent at any time</li>
                <li><strong>Object:</strong> Object to processing of your information</li>
                <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@middlez.com" className="text-blue-600 underline">
                  privacy@middlez.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence.
                We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Children's Privacy</h2>
              <p>
                Our surveys are not intended for individuals under 18 years of age. We do not knowingly collect personal
                information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
                the new policy on this page and updating the "Effective Date" above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">13. Compliance</h2>
              <p>This Privacy Policy complies with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Australian Privacy Principles (APPs)</li>
                <li>General Data Protection Regulation (GDPR)</li>
                <li>Other applicable data protection laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mt-8 mb-4">14. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <p><strong>Middle Z</strong></p>
                <p>Email: <a href="mailto:privacy@middlez.com" className="text-blue-600 underline">privacy@middlez.com</a></p>
                <p>Website: <a href="https://middlez.com" className="text-blue-600 underline">https://middlez.com</a></p>
              </div>
            </section>

            <section className="mt-12 pt-8 border-t">
              <p className="text-sm text-gray-600">
                By using our survey system, you acknowledge that you have read and understood this Privacy Policy and
                agree to its terms.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  )
}
