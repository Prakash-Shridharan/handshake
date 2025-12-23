import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import { Job } from '@/contexts/JobsContext';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="hover-lift animate-slide-up overflow-hidden group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <UrgencyBadge urgency={job.urgency} />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {job.description}
        </p>
        <div className="flex flex-col gap-2 text-sm">
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
      <CardFooter className="pt-0">
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
