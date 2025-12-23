import { format } from 'date-fns';
import { Briefcase, DollarSign, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { useJobs } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';

export default function MyBidsPage() {
  const { bids, getJobById } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myBids = bids.filter(bid => bid.contractorId === user?.id);
  
  const pendingBids = myBids.filter(bid => bid.status === 'pending');
  const acceptedBids = myBids.filter(bid => bid.status === 'accepted');
  const rejectedBids = myBids.filter(bid => bid.status === 'rejected');

  const totalBidValue = myBids.reduce((sum, bid) => sum + bid.price, 0);
  const wonBidValue = acceptedBids.reduce((sum, bid) => sum + bid.price, 0);

  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-warning/10 text-warning border-warning/20',
    },
    accepted: {
      label: 'Accepted',
      icon: CheckCircle2,
      className: 'bg-success/10 text-success border-success/20',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">My Bids</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of all your submitted quotes
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bids"
            value={myBids.length}
            icon={<Briefcase className="h-6 w-6" />}
            description="All submitted"
          />
          <StatCard
            title="Pending"
            value={pendingBids.length}
            icon={<Clock className="h-6 w-6" />}
            description="Awaiting response"
          />
          <StatCard
            title="Won"
            value={acceptedBids.length}
            icon={<CheckCircle2 className="h-6 w-6" />}
            description="Jobs awarded"
          />
          <StatCard
            title="Won Value"
            value={`$${wonBidValue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            description="Total contracted"
          />
        </div>

        {/* Bids List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Bid History</CardTitle>
            <CardDescription>
              View all your submitted quotes and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myBids.length > 0 ? (
              <div className="space-y-4">
                {myBids.map((bid, index) => {
                  const job = getJobById(bid.jobId);
                  const config = statusConfig[bid.status];
                  const StatusIcon = config.icon;

                  return (
                    <div 
                      key={bid.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-all animate-fade-in cursor-pointer"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => navigate(`/jobs/${bid.jobId}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold">{job?.title || 'Unknown Job'}</h3>
                          <Badge variant="outline" className={config.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job?.location || 'Location unavailable'}
                        </p>
                        {bid.notes && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {bid.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xl font-bold">${bid.price}</p>
                          <p className="text-xs text-muted-foreground">
                            Est. {format(bid.estimatedDate, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">No bids yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start browsing the job board to submit your first bid.
                </p>
                <Button onClick={() => navigate('/marketplace')}>
                  Browse Jobs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
