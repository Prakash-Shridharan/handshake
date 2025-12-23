import { Briefcase, FileText, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobsContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/ui/stat-card';
import { JobsTable } from '@/components/jobs/JobsTable';
import { CreateJobDialog } from '@/components/jobs/CreateJobDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentDashboard() {
  const { user } = useAuth();
  const { jobs, invoices } = useJobs();

  const myJobs = jobs.filter(job => job.createdBy === user?.id);
  const activeJobs = myJobs.filter(job => job.status !== 'completed').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const completedJobs = myJobs.filter(job => job.status === 'completed').length;
  const openJobs = myJobs.filter(job => job.status === 'open').length;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your property maintenance jobs
            </p>
          </div>
          <CreateJobDialog />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Jobs"
            value={activeJobs}
            icon={<Briefcase className="h-6 w-6" />}
            description="Currently in progress"
          />
          <StatCard
            title="Open Jobs"
            value={openJobs}
            icon={<Clock className="h-6 w-6" />}
            description="Awaiting bids"
          />
          <StatCard
            title="Completed"
            value={completedJobs}
            icon={<CheckCircle2 className="h-6 w-6" />}
            description="This month"
          />
          <StatCard
            title="Pending Invoices"
            value={pendingInvoices}
            icon={<FileText className="h-6 w-6" />}
            description="Awaiting payment"
          />
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl">My Job Postings</CardTitle>
            <CardDescription>
              Manage and track all your maintenance requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobsTable jobs={myJobs} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
