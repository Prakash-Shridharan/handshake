import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import { Job } from '@/contexts/JobsContext';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  index?: number;
}

// Map job keywords to relevant Unsplash search terms
const getImageKeyword = (title: string): string => {
  const keywords: Record<string, string> = {
    plumbing: 'plumbing,pipes',
    pipe: 'plumbing,pipes',
    leak: 'water,plumbing',
    hvac: 'hvac,air-conditioning',
    heating: 'heating,radiator',
    cooling: 'air-conditioning',
    electrical: 'electrical,wiring',
    wiring: 'electrical,wiring',
    paint: 'painting,wall',
    roof: 'roofing,construction',
    window: 'window,glass',
    door: 'door,entrance',
    floor: 'flooring,hardwood',
    kitchen: 'kitchen,renovation',
    bathroom: 'bathroom,renovation',
    garden: 'garden,landscaping',
    lawn: 'lawn,landscaping',
  };
  
  const lowerTitle = title.toLowerCase();
  for (const [key, value] of Object.entries(keywords)) {
    if (lowerTitle.includes(key)) {
      return value;
    }
  }
  return 'home-repair,maintenance';
};

export function JobCard({ job, index = 0 }: JobCardProps) {
  const navigate = useNavigate();
  const imageKeyword = getImageKeyword(job.title);
  // Use a consistent image per job by using job.id as seed
  const imageUrl = `https://source.unsplash.com/400x200/?${imageKeyword}&sig=${job.id}`;

  return (
    <Card 
      className="hover-lift animate-slide-up overflow-hidden group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={job.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <UrgencyBadge urgency={job.urgency} />
        </div>
      </div>
      
      <CardContent className="pt-4 pb-3">
        <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors mb-2">
          {job.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Posted {format(job.createdAt, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full group/btn gap-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/jobs/${job.id}`);
          }}
        >
          Apply Now
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}