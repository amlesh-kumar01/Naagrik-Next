import Link from 'next/link'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  Bell, 
  CheckCircle,
  Handshake,
  Sprout,
  Heart,
  Globe,
  ArrowLeft,
  Mail
} from 'lucide-react'

export default function AboutPage() {
  const steps = [
    {
      icon: Search,
      title: "Spot an Issue",
      description: "See a problem in your area? Start here.",
      color: "text-indigo-600"
    },
    {
      icon: MessageSquare,
      title: "Report on Naagrik",
      description: "Add details, location, and a photo in seconds.",
      color: "text-orange-500"
    },
    {
      icon: ThumbsUp,
      title: "Community Upvotes",
      description: "Neighbors support and comment to boost visibility.",
      color: "text-indigo-600"
    },
    {
      icon: Bell,
      title: "Authorities Notified",
      description: "Relevant officials are alerted and progress is tracked.",
      color: "text-orange-500"
    },
    {
      icon: CheckCircle,
      title: "Celebrate Solutions",
      description: "See resolved issues and a better community!",
      color: "text-indigo-600"
    }
  ]

  const values = [
    { icon: "🤝", title: "Transparency" },
    { icon: "🌱", title: "Empowerment" },
    { icon: "🤗", title: "Collaboration" },
    { icon: "🌍", title: "Inclusivity" }
  ]

  const team = [
    {
      name: "Ashwani Pathak",
      role: "Founder",
      color: "bg-indigo-600"
    },
    {
      name: "Your Name",
      role: "Contributor",
      color: "bg-orange-500"
    },
    {
      name: "You?",
      role: "Join us!",
      color: "bg-indigo-600"
    }
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            About <span className="text-indigo-600">Naagrik</span>
          </h1>
          <p className="text-xl text-gray-600">
            Empowering communities to report, track, and resolve local issues together.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-semibold text-lg">{value.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <div className={`w-full h-full rounded-full ${member.color} flex items-center justify-center`}>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Contact & Team</h2>
          <p className="text-gray-600 mb-8">
            For queries, suggestions, or to join our mission, email{' '}
            <a 
              href="mailto:info@naagrik.app" 
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              info@naagrik.app
            </a>
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              &copy; 2024 Naagrik. All rights reserved.
            </p>
            
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}
