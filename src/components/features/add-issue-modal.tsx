'use client'

import { useState } from 'react'
import { X, Upload, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateIssueData } from '@/types'
import { api } from '@/lib/api'

interface AddIssueModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateIssueData) => void
  isLoading?: boolean
  selectedLocation?: { lat: number; lng: number } | null
}

const categories = [
  'Road',
  'Water',
  'Electricity',
  'Sanitation',
  'Public Safety',
  'Environment',
  'Transportation',
  'Healthcare',
  'Education',
  'Other'
]

export function AddIssueModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false,
  selectedLocation 
}: AddIssueModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: ''
  })
  const [image, setImage] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleImageUpload = async (file: File) => {
    try {
      const response = await api.upload<{ url: string }>('/upload', file, 'image')
      setUploadedImageUrl(response.url)
      console.log('Image uploaded successfully:', response.url)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. You can still submit without an image.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!selectedLocation) newErrors.location = 'Please select a location on the map'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const issueData: CreateIssueData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      location: {
        lat: selectedLocation!.lat,
        lng: selectedLocation!.lng
      },
      photo: uploadedImageUrl || undefined
    }

    onSubmit(issueData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      handleImageUpload(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Report New Issue</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Detailed description of the issue"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isLoading}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Address (Optional)
              </label>
              <Input
                placeholder="Street address or landmark"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location *
              </label>
              {selectedLocation ? (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </span>
                </div>
              ) : (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    Click on the map to select a location
                  </p>
                </div>
              )}
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Image (Optional)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                <Upload className="w-4 h-4 text-gray-400" />
              </div>
              {image && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {image.name}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
