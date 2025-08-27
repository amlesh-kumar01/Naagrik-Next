'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock,
  Phone,
  AlertTriangle,
  Shield,
  Flame,
  Heart,
  Users,
  ArrowLeft,
  MapPin,
  Loader2,
  CheckCircle
} from 'lucide-react'

interface EmergencyContact {
  title: string
  number: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  description: string
}

export default function EmergencyPage() {
  const [locationState, setLocationState] = useState<{
    loading: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({ loading: false, message: '', type: 'info' })

  const emergencySteps = [
    { icon: Clock, title: "Stay Calm", color: "text-red-500", description: "Take deep breaths and assess the situation" },
    { icon: Phone, title: "Call for Help", color: "text-indigo-600", description: "Contact appropriate emergency services" },
    { icon: MapPin, title: "Share Location", color: "text-orange-500", description: "Provide exact location to responders" },
    { icon: Shield, title: "Stay Safe", color: "text-green-600", description: "Move to a secure location if possible" },
    { icon: Users, title: "Wait for Help", color: "text-purple-600", description: "Follow instructions from emergency services" }
  ]

  const emergencyContacts: EmergencyContact[] = [
    {
      title: "Police",
      number: "100",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
      description: "Crime, theft, law & order"
    },
    {
      title: "Fire Brigade",
      number: "101",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      description: "Fire emergencies & rescue"
    },
    {
      title: "Ambulance",
      number: "102",
      icon: Heart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 border-indigo-200",
      description: "Medical emergencies"
    },
    {
      title: "Women Helpline",
      number: "1091",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
      description: "Women's safety & support"
    },
    {
      title: "Disaster Management",
      number: "108",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200",
      description: "Natural disasters & crisis"
    }
  ]

  const shareLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState({
        loading: false,
        message: 'Geolocation not supported on this device.',
        type: 'error'
      })
      setTimeout(() => setLocationState(prev => ({ ...prev, message: '' })), 3000)
      return
    }

    setLocationState({
      loading: true,
      message: 'Getting your location...',
      type: 'info'
    })
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)
        const locationString = `${lat}, ${lng}`
        
        // Copy to clipboard
        navigator.clipboard.writeText(locationString).then(() => {
          setLocationState({
            loading: false,
            message: `Location copied: ${locationString}`,
            type: 'success'
          })
          setTimeout(() => setLocationState(prev => ({ ...prev, message: '' })), 5000)
        }).catch(() => {
          setLocationState({
            loading: false,
            message: `Location: ${locationString} (Copy manually)`,
            type: 'info'
          })
          setTimeout(() => setLocationState(prev => ({ ...prev, message: '' })), 5000)
        })
      },
      (error) => {
        let errorMessage = 'Unable to get location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        
        setLocationState({
          loading: false,
          message: errorMessage,
          type: 'error'
        })
        setTimeout(() => setLocationState(prev => ({ ...prev, message: '' })), 3000)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }, [])

  const getMessageStyles = () => {
    switch (locationState.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700'
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Emergency <span className="text-red-600">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quick access to essential emergency numbers and services for your safety and well-being.
          </p>
        </div>

        {/* Emergency Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What to do in an Emergency</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {emergencySteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Share Location Button */}
        <div className="text-center mb-12">
          <Button
            onClick={shareLocation}
            size="lg"
            disabled={locationState.loading}
            className="gap-2 bg-red-600 hover:bg-red-700 transition-colors px-8 py-3 text-lg shadow-lg"
          >
            {locationState.loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
            {locationState.loading ? 'Getting Location...' : 'Share My Location'}
          </Button>
          
          {locationState.message && (
            <div className={`mt-4 p-4 border rounded-lg max-w-md mx-auto ${getMessageStyles()}`}>
              <div className="flex items-center gap-2 justify-center">
                {locationState.type === 'success' && <CheckCircle className="w-4 h-4" />}
                {locationState.type === 'error' && <AlertTriangle className="w-4 h-4" />}
                <p className="text-sm font-medium">{locationState.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Emergency Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => {
              const Icon = contact.icon
              return (
                <Card key={index} className={`hover:shadow-xl transition-all duration-300 border-2 ${contact.bgColor} bg-white/90 backdrop-blur-sm`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                        <Icon className={`w-8 h-8 ${contact.color}`} />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{contact.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{contact.description}</p>
                    <a
                      href={`tel:${contact.number}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
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

        {/* Important Notice */}
        <section className="mb-12">
          <Card className="bg-yellow-50 border-yellow-200 border-2">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2 text-gray-900">Important Notice</h3>
              <p className="text-gray-700">
                In case of extreme emergency, always call the appropriate emergency number first. 
                These numbers are toll-free and available 24/7 across India.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button variant="outline" className="gap-2 px-6 py-3 shadow-md hover:shadow-lg transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>For more local helplines, contact your city administration.</p>
            <p>&copy; 2024 Naagrik - Emergency Services Directory</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
