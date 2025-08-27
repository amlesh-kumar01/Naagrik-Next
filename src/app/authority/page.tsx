import Link from 'next/link'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Droplets,
  Zap,
  Truck,
  Wrench,
  ArrowLeft,
  Plus
} from 'lucide-react'

interface AuthorityContact {
  title: string
  number: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

export default function AuthorityPage() {
  const escalationSteps = [
    { icon: MessageSquare, title: "Report on Naagrik", color: "text-indigo-600" },
    { icon: Phone, title: "Contact Authority", color: "text-orange-500" },
    { icon: Clock, title: "Follow Up", color: "text-indigo-600" },
    { icon: AlertTriangle, title: "Escalate if Needed", color: "text-orange-500" },
    { icon: CheckCircle, title: "Share Feedback", color: "text-indigo-600" }
  ]

  const authorityContacts: AuthorityContact[] = [
    {
      title: "Municipal Corp.",
      number: "1800-123-456",
      icon: Building,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Water Supply",
      number: "1800-654-321",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200"
    },
    {
      title: "Electricity Board",
      number: "1800-112-233",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200"
    },
    {
      title: "Sanitation",
      number: "1800-223-344",
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200"
    },
    {
      title: "Public Works",
      number: "1800-334-455",
      icon: Wrench,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    }
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Authority <span className="text-indigo-600">Contacts</span>
          </h1>
          <p className="text-xl text-gray-600">
            Reach out to your local authorities for civic services and support.
          </p>
        </div>

        {/* Escalation Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How to Escalate an Issue</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {escalationSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Submit Request Button */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Submit a Request
            </Button>
          </Link>
        </div>

        {/* Authority Contacts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Authority Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorityContacts.map((contact, index) => {
              const Icon = contact.icon
              return (
                <Card key={index} className={`hover:shadow-lg transition-shadow border-2 ${contact.bgColor}`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${contact.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-4">{contact.title}</h3>
                    <a
                      href={`tel:${contact.number}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all shadow-lg hover:shadow-xl`}
                    >
                      <Phone className="w-4 h-4" />
                      {contact.number}
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>For more local authorities, contact your city administration.</p>
            <p className="mt-2">&copy; 2024 Naagrik</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
