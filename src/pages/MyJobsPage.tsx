import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobsContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { JobsTable } from '@/components/jobs/JobsTable';
import { CreateJobDialog } from '@/components/jobs/CreateJobDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyJobsPage() {
  const { user } = useAuth();
  const { jobs } = useJobs();

  const myJobs = jobs.filter(job => job.createdBy === user?.id);
  const openJobs = myJobs.filter(job => job.status === 'open');
  const activeJobs = myJobs.filter(job => job.status === 'assigned' || job.status === 'in_progress');
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your maintenance job postings
            </p>
          </div>
          <CreateJobDialog />
        </div>

        {/* Jobs with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Job Postings</CardTitle>
            <CardDescription>
              Filter and view jobs by their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All ({myJobs.length})
                </TabsTrigger>
                <TabsTrigger value="open">
                  Open ({openJobs.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeJobs.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedJobs.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <JobsTable jobs={myJobs} />
              </TabsContent>
              <TabsContent value="open">
                <JobsTable jobs={openJobs} />
              </TabsContent>
              <TabsContent value="active">
                <JobsTable jobs={activeJobs} />
              </TabsContent>
              <TabsContent value="completed">
                <JobsTable jobs={completedJobs} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
