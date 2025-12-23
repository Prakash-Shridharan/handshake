import { format } from 'date-fns';
import { FileText, DollarSign, CheckCircle2, Clock, Building2, User } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useJobs } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';

export default function InvoicesPage() {
  const { invoices } = useJobs();
  const { user } = useAuth();

  const isAgent = user?.role === 'agent';

  // Filter invoices based on user role
  const myInvoices = invoices.filter(inv => 
    isAgent ? inv.agentId === user?.id : inv.contractorId === user?.id
  );

  const pendingTotal = myInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const paidTotal = myInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            {isAgent ? 'Manage payments for completed jobs' : 'Track your earnings from completed jobs'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Invoices"
            value={myInvoices.length}
            icon={<FileText className="h-6 w-6" />}
            description="All time"
          />
          <StatCard
            title={isAgent ? 'Pending Payment' : 'Pending Earnings'}
            value={`$${pendingTotal.toLocaleString()}`}
            icon={<Clock className="h-6 w-6" />}
            description="Awaiting payment"
          />
          <StatCard
            title={isAgent ? 'Total Paid' : 'Total Earned'}
            value={`$${paidTotal.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6" />}
            description="This month"
          />
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Invoice History</CardTitle>
            <CardDescription>
              View all invoices and their payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myInvoices.length > 0 ? (
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Invoice ID</TableHead>
                      <TableHead className="font-semibold">Job</TableHead>
                      <TableHead className="font-semibold">
                        {isAgent ? 'Contractor' : 'Agent'}
                      </TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myInvoices.map((invoice, index) => (
                      <TableRow 
                        key={invoice.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <TableCell className="font-mono text-sm">
                          {invoice.id.slice(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {invoice.jobTitle}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isAgent ? (
                              <User className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{invoice.contractorName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${invoice.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              invoice.status === 'paid'
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-warning/10 text-warning border-warning/20'
                            }
                          >
                            {invoice.status === 'paid' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(invoice.createdAt, 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">No invoices yet</h3>
                <p className="text-muted-foreground text-sm">
                  Invoices will appear here when jobs are completed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
