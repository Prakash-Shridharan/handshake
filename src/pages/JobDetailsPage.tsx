import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  DollarSign,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UrgencyBadge } from '@/components/ui/urgency-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useJobs, Bid } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const bidSchema = z.object({
  price: z.string().min(1, 'Price is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Price must be a positive number'
  ),
  estimatedDate: z.string().min(1, 'Estimated completion date is required'),
  notes: z.string().max(500).optional(),
});

type BidFormData = z.infer<typeof bidSchema>;

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getJobById, getJobBids, submitBid, acceptBid, completeJob } = useJobs();
  
  const job = getJobById(id || '');
  const bids = getJobBids(id || '');

  const form = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      price: '',
      estimatedDate: '',
      notes: '',
    },
  });

  if (!job) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="font-display text-xl font-semibold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-4">This job may have been removed.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isAgent = user?.role === 'agent';
  const isContractor = user?.role === 'contractor';
  const hasSubmittedBid = bids.some(bid => bid.contractorId === user?.id);
  const acceptedBid = bids.find(bid => bid.status === 'accepted');

  const onSubmitBid = (data: BidFormData) => {
    if (!user) return;

    submitBid({
      jobId: job.id,
      contractorId: user.id,
      contractorName: user.name,
      companyName: user.companyName,
      price: Number(data.price),
      estimatedDate: new Date(data.estimatedDate),
      notes: data.notes,
    });

    toast.success('Bid submitted successfully!', {
      description: 'The property agent will review your bid.',
    });

    form.reset();
  };

  const handleAcceptBid = (bidId: string) => {
    acceptBid(bidId);
    toast.success('Bid accepted!', {
      description: 'The contractor has been notified.',
    });
  };

  const handleCompleteJob = () => {
    completeJob(job.id);
    toast.success('Job marked as completed!', {
      description: 'An invoice has been generated.',
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Job Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="font-display text-2xl">{job.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <UrgencyBadge urgency={job.urgency} />
                  <StatusBadge status={job.status} />
                </div>
              </div>
              {isAgent && job.status === 'in_progress' && (
                <Button onClick={handleCompleteJob} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{job.description}</p>
            
            <Separator />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Posted</p>
                  <p className="font-medium">{format(job.createdAt, 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contractor: Submit Bid Form */}
        {isContractor && job.status === 'open' && !hasSubmittedBid && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Your Quote
              </CardTitle>
              <CardDescription>
                Provide your pricing and estimated completion date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitBid)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote Amount ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Completion</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional details about your quote..."
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto gap-2">
                    <Send className="h-4 w-4" />
                    Submit Quote
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Contractor: Already Submitted */}
        {isContractor && hasSubmittedBid && (
          <Card className="border-success/50 bg-success/5">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Quote Submitted</h3>
                <p className="text-sm text-muted-foreground">
                  You've already submitted a quote for this job. The agent will review it soon.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agent: View Bids */}
        {isAgent && bids.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Received Quotes ({bids.length})
              </CardTitle>
              <CardDescription>
                Review and accept quotes from contractors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bids.map((bid) => (
                <BidCard 
                  key={bid.id} 
                  bid={bid} 
                  onAccept={handleAcceptBid}
                  isAcceptable={job.status === 'open'}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Agent: No Bids Yet */}
        {isAgent && bids.length === 0 && job.status === 'open' && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">No quotes yet</h3>
              <p className="text-muted-foreground text-sm">
                Contractors will start submitting quotes soon.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Assigned Contractor Info */}
        {acceptedBid && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                Assigned Contractor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                    {acceptedBid.contractorName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{acceptedBid.contractorName}</p>
                  <p className="text-sm text-muted-foreground">{acceptedBid.companyName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${acceptedBid.price}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {format(acceptedBid.estimatedDate, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

function BidCard({ 
  bid, 
  onAccept,
  isAcceptable 
}: { 
  bid: Bid; 
  onAccept: (bidId: string) => void;
  isAcceptable: boolean;
}) {
  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    accepted: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
      <Avatar className="h-12 w-12 border-2 border-muted">
        <AvatarFallback className="bg-muted font-semibold">
          {bid.contractorName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold">{bid.contractorName}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColors[bid.status]}`}>
            {bid.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{bid.companyName}</p>
        {bid.notes && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{bid.notes}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xl font-bold">${bid.price}</p>
          <p className="text-xs text-muted-foreground">
            Est. {format(bid.estimatedDate, 'MMM d')}
          </p>
        </div>
        {isAcceptable && bid.status === 'pending' && (
          <Button onClick={() => onAccept(bid.id)} size="sm" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </Button>
        )}
      </div>
    </div>
  );
}
