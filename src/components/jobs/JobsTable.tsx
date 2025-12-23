import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Job } from '@/contexts/JobsContext';

interface JobsTableProps {
  jobs: Job[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  const navigate = useNavigate();

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-1">No jobs found</h3>
        <p className="text-muted-foreground text-sm">Create your first job to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Location</TableHead>
            <TableHead className="font-semibold">Urgency</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job, index) => (
            <TableRow 
              key={job.id} 
              className="animate-fade-in cursor-pointer hover:bg-muted/50 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[200px]">{job.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <UrgencyBadge urgency={job.urgency} />
              </TableCell>
              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(job.createdAt, 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
