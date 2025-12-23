import React, { createContext, useContext, useState, useCallback } from 'react';

export type JobUrgency = 'low' | 'high' | 'emergency';
export type JobStatus = 'open' | 'assigned' | 'in_progress' | 'completed';
export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: JobUrgency;
  status: JobStatus;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
}

export interface Bid {
  id: string;
  jobId: string;
  contractorId: string;
  contractorName: string;
  companyName: string;
  price: number;
  estimatedDate: Date;
  notes?: string;
  status: BidStatus;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  jobId: string;
  jobTitle: string;
  bidId: string;
  agentId: string;
  contractorId: string;
  contractorName: string;
  amount: number;
  status: 'pending' | 'paid';
  createdAt: Date;
}

interface JobsContextType {
  jobs: Job[];
  bids: Bid[];
  invoices: Invoice[];
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'status'>) => void;
  submitBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'status'>) => void;
  acceptBid: (bidId: string) => void;
  completeJob: (jobId: string) => void;
  getJobBids: (jobId: string) => Bid[];
  getJobById: (jobId: string) => Job | undefined;
}

const initialJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Kitchen Sink Leak Repair',
    description: 'Water leaking from under the kitchen sink. Tenant reports water pooling daily.',
    location: '123 Oak Street, Apt 4B',
    urgency: 'high',
    status: 'open',
    createdBy: 'agent-001',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'job-002',
    title: 'HVAC System Maintenance',
    description: 'Annual HVAC inspection and filter replacement for the property.',
    location: '456 Maple Avenue',
    urgency: 'low',
    status: 'assigned',
    createdBy: 'agent-001',
    assignedTo: 'contractor-001',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'job-003',
    title: 'Emergency Pipe Burst',
    description: 'Main water pipe burst in basement. Immediate attention required.',
    location: '789 Pine Road, Unit 12',
    urgency: 'emergency',
    status: 'in_progress',
    createdBy: 'agent-001',
    assignedTo: 'contractor-002',
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'job-004',
    title: 'Exterior Paint Touch-Up',
    description: 'Touch up paint on exterior trim and door frames.',
    location: '321 Elm Street',
    urgency: 'low',
    status: 'completed',
    createdBy: 'agent-001',
    assignedTo: 'contractor-001',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'job-005',
    title: 'Roof Inspection',
    description: 'Annual roof inspection after recent storms.',
    location: '654 Cedar Lane',
    urgency: 'high',
    status: 'open',
    createdBy: 'agent-001',
    createdAt: new Date('2024-01-17'),
  },
];

const initialBids: Bid[] = [
  {
    id: 'bid-001',
    jobId: 'job-001',
    contractorId: 'contractor-001',
    contractorName: 'Mike Rodriguez',
    companyName: 'QuickFix Pro Services',
    price: 250,
    estimatedDate: new Date('2024-01-20'),
    notes: 'Can complete within 24 hours of acceptance.',
    status: 'pending',
    createdAt: new Date('2024-01-16'),
  },
  {
    id: 'bid-002',
    jobId: 'job-001',
    contractorId: 'contractor-002',
    contractorName: 'Lisa Chen',
    companyName: 'Premier Plumbing',
    price: 320,
    estimatedDate: new Date('2024-01-19'),
    notes: 'Includes full pipe inspection.',
    status: 'pending',
    createdAt: new Date('2024-01-16'),
  },
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv-001',
    jobId: 'job-004',
    jobTitle: 'Exterior Paint Touch-Up',
    bidId: 'bid-old-001',
    agentId: 'agent-001',
    contractorId: 'contractor-001',
    contractorName: 'Mike Rodriguez',
    amount: 450,
    status: 'paid',
    createdAt: new Date('2024-01-08'),
  },
];

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const createJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt' | 'status'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: 'open',
      createdAt: new Date(),
    };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const submitBid = useCallback((bidData: Omit<Bid, 'id' | 'createdAt' | 'status'>) => {
    const newBid: Bid = {
      ...bidData,
      id: `bid-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
    };
    setBids(prev => [...prev, newBid]);
  }, []);

  const acceptBid = useCallback((bidId: string) => {
    const bid = bids.find(b => b.id === bidId);
    if (!bid) return;

    setBids(prev => prev.map(b => 
      b.id === bidId 
        ? { ...b, status: 'accepted' as BidStatus }
        : b.jobId === bid.jobId 
          ? { ...b, status: 'rejected' as BidStatus }
          : b
    ));

    setJobs(prev => prev.map(j => 
      j.id === bid.jobId 
        ? { ...j, status: 'in_progress' as JobStatus, assignedTo: bid.contractorId }
        : j
    ));
  }, [bids]);

  const completeJob = useCallback((jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const acceptedBid = bids.find(b => b.jobId === jobId && b.status === 'accepted');
    if (!acceptedBid) return;

    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: 'completed' as JobStatus } : j
    ));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      bidId: acceptedBid.id,
      agentId: job.createdBy,
      contractorId: acceptedBid.contractorId,
      contractorName: acceptedBid.contractorName,
      amount: acceptedBid.price,
      status: 'pending',
      createdAt: new Date(),
    };
    setInvoices(prev => [newInvoice, ...prev]);
  }, [jobs, bids]);

  const getJobBids = useCallback((jobId: string) => {
    return bids.filter(b => b.jobId === jobId);
  }, [bids]);

  const getJobById = useCallback((jobId: string) => {
    return jobs.find(j => j.id === jobId);
  }, [jobs]);

  return (
    <JobsContext.Provider value={{
      jobs,
      bids,
      invoices,
      createJob,
      submitBid,
      acceptBid,
      completeJob,
      getJobBids,
      getJobById,
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}
