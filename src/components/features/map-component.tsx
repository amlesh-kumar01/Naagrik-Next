'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Issue } from '@/types'

// Fix for default markers in Next.js
type LeafletIcon = {
  Default: {
    prototype: Record<string, unknown>
    mergeOptions: (options: Record<string, string>) => void
  }
}

const leafletIcon = L.Icon as unknown as LeafletIcon
delete leafletIcon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  issues: Issue[]
  onMapClick?: (lat: number, lng: number) => void
  selectedIssue?: Issue | null
  selectedLocation?: { lat: number; lng: number }
  showAddMarker?: boolean
  center?: [number, number]
  zoom?: number
}

export function MapComponent({ 
  issues, 
  onMapClick, 
  selectedIssue,
  selectedLocation,
  showAddMarker = false,
  center = [28.6139, 77.2090], 
  zoom = 13 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const selectedMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map with proper container constraints
    const map = L.map(mapRef.current, {
      preferCanvas: true,
      attributionControl: true,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    }).setView(center, zoom)
    
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
    }).addTo(map)

    // Force resize after initialization
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    // Handle map clicks
    if (onMapClick) {
      map.on('click', (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng)
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, onMapClick])

  // Handle window resize to ensure map stays within bounds
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize()
        }, 100)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Add issue markers
    issues.forEach(issue => {
      if (!mapInstanceRef.current) return

      const marker = L.marker([issue.location.lat, issue.location.lng])
        .addTo(mapInstanceRef.current)

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px] max-w-[250px]">
          <h3 class="font-semibold text-lg mb-2 break-words">${issue.title}</h3>
          <p class="text-sm text-gray-600 mb-2 break-words">${issue.description}</p>
          <div class="flex items-center justify-between flex-wrap gap-1">
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100">${issue.category}</span>
            <span class="text-xs px-2 py-1 rounded-full ${
              issue.status === 'OPEN' ? 'bg-red-100 text-red-800' :
              issue.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">${issue.status}</span>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Reported by: ${issue.user.username}
          </div>
          <div class="mt-1 text-xs text-gray-500">
            Upvotes: ${issue.upvotes}
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        closeButton: true,
        autoClose: false
      })
      markersRef.current.push(marker)

      // Open popup if this is the selected issue
      if (selectedIssue && selectedIssue.id === issue.id) {
        marker.openPopup()
      }
    })
  }, [issues, selectedIssue])

  // Handle selected location marker for adding new issues
  useEffect(() => {
    if (!mapInstanceRef.current || !showAddMarker) return

    // Remove existing selected location marker
    if (selectedMarkerRef.current) {
      mapInstanceRef.current.removeLayer(selectedMarkerRef.current)
      selectedMarkerRef.current = null
    }

    // Add new selected location marker
    if (selectedLocation) {
      // Create a red marker for the selected location
      const redIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: #ef4444;
          width: 25px;
          height: 25px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 24]
      })

      selectedMarkerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: redIcon
      }).addTo(mapInstanceRef.current)

      selectedMarkerRef.current.bindPopup('📍 New issue location')
    }
  }, [selectedLocation, showAddMarker])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  )
}
