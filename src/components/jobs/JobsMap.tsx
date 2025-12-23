import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Job } from '@/contexts/JobsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface JobsMapProps {
  jobs: Job[];
  onJobSelect?: (jobId: string) => void;
}

// Mock coordinates for demo locations
const locationCoordinates: Record<string, [number, number]> = {
  'Downtown Toronto': [-79.3832, 43.6532],
  'North York': [-79.4111, 43.7615],
  'Scarborough': [-79.2577, 43.7764],
  'Etobicoke': [-79.5547, 43.6205],
  'Mississauga': [-79.6441, 43.5890],
};

const getCoordinates = (location: string): [number, number] => {
  // Try exact match first
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }
  // Try partial match
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (location.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }
  // Default to Toronto center with slight offset
  return [-79.3832 + (Math.random() - 0.5) * 0.1, 43.6532 + (Math.random() - 0.5) * 0.1];
};

const urgencyColors: Record<string, string> = {
  low: '#0EA5E9',
  high: '#F59E0B',
  emergency: '#EF4444',
};

export function JobsMap({ jobs, onJobSelect }: JobsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>(() => 
    localStorage.getItem('mapbox_token') || ''
  );
  const [isTokenSet, setIsTokenSet] = useState(() => !!localStorage.getItem('mapbox_token'));

  const handleSetToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      setIsTokenSet(true);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-79.3832, 43.6532], // Toronto center
      zoom: 10,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken]);

  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each job
    jobs.forEach(job => {
      const coords = getCoordinates(job.location);
      const color = urgencyColors[job.urgency] || '#C2410C';

      const el = document.createElement('div');
      el.className = 'job-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      `;
      el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="${color}"/></svg>`;
      
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
      el.addEventListener('click', () => {
        onJobSelect?.(job.id);
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="font-weight: 600; margin-bottom: 4px; color: #1e293b;">${job.title}</h3>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 4px;">${job.location}</p>
          <span style="
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 500;
            background-color: ${color}20;
            color: ${color};
            text-transform: capitalize;
          ">${job.urgency}</span>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (jobs.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      jobs.forEach(job => {
        const coords = getCoordinates(job.location);
        bounds.extend(coords);
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [jobs, isTokenSet, onJobSelect]);

  if (!isTokenSet) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2">Enable Map View</h3>
        <p className="text-muted-foreground text-sm text-center mb-4 max-w-md">
          Enter your Mapbox public token to view job locations on the map. 
          Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="pk.eyJ1Ijoi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSetToken} disabled={!mapboxToken.trim()}>
            Enable Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-border shadow-sm">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
