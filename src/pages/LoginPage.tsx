import { Building2, HardHat, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';
export default function LoginPage() {
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleLogin = (role: UserRole) => {
    login(role);
    navigate(role === 'agent' ? '/dashboard' : '/marketplace');
  };
  return <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-foreground rounded-full blur-2xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm font-display font-bold text-2xl">H</div>
              <h1 className="font-display text-3xl font-bold">Handshake</h1>
            </div>
            <p className="text-primary-foreground/80 text-lg">Property Maintenance Marketplace</p>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-6">
              <Feature icon={<Zap className="h-5 w-5" />} title="Fast Job Matching" description="Connect with qualified contractors in minutes" />
              <Feature icon={<Shield className="h-5 w-5" />} title="Verified Professionals" description="All contractors are vetted and insured" />
              <Feature icon={<Users className="h-5 w-5" />} title="Transparent Pricing" description="Compare quotes and choose the best fit" />
            </div>
          </div>
          
          <p className="text-sm text-primary-foreground/60">© 2024 Handshake. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Login Options */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-2xl">
                R
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Rentr</h1>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Welcome to Handshake</h2>
            <p className="text-muted-foreground mt-2">Select your role to continue</p>
          </div>

          <div className="grid gap-4">
            <RoleCard role="agent" icon={<Building2 className="h-8 w-8" />} title="Property Agent" description="Post maintenance jobs and manage work orders" onClick={() => handleLogin('agent')} />
            <RoleCard role="contractor" icon={<HardHat className="h-8 w-8" />} title="Contractor" description="Browse jobs and submit competitive bids" onClick={() => handleLogin('contractor')} />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Demo mode: Click a role to explore the platform
          </p>
        </div>
      </div>
    </div>;
}
function Feature({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return <div className="flex gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-primary-foreground/70">{description}</p>
      </div>
    </div>;
}
function RoleCard({
  role,
  icon,
  title,
  description,
  onClick
}: {
  role: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return <Card className="group cursor-pointer hover-lift border-2 border-transparent hover:border-primary/20 transition-all duration-300" onClick={onClick}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </CardContent>
    </Card>;
}