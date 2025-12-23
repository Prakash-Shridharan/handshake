import { useState } from 'react';
import { Search, SlidersHorizontal, Briefcase, LayoutGrid, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { JobCard } from '@/components/jobs/JobCard';
import { JobsMap } from '@/components/jobs/JobsMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useJobs, JobUrgency } from '@/contexts/JobsContext';

type ViewMode = 'grid' | 'map';

export default function ContractorMarketplace() {
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<JobUrgency | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const openJobs = jobs.filter(job => job.status === 'open');

  const filteredJobs = openJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUrgency = urgencyFilter === 'all' || job.urgency === urgencyFilter;

    return matchesSearch && matchesUrgency;
  });

  const handleJobSelect = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Job Board
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and bid on available maintenance jobs
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select 
            value={urgencyFilter} 
            onValueChange={(value) => setUrgencyFilter(value as JobUrgency | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgencies</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none px-3 border-l border-border"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{filteredJobs.length} jobs available</span>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <JobsMap jobs={filteredJobs} onJobSelect={handleJobSelect} />
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">No jobs found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
