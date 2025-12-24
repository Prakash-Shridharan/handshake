import { Home, Briefcase, Search, FileText, LogOut, User, Building2 } from 'lucide-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
const agentNavItems = [{
  title: 'Dashboard',
  url: '/dashboard',
  icon: Home
}, {
  title: 'My Jobs',
  url: '/jobs',
  icon: Briefcase
}, {
  title: 'Invoices',
  url: '/invoices',
  icon: FileText
}];
const contractorNavItems = [{
  title: 'Job Board',
  url: '/marketplace',
  icon: Search
}, {
  title: 'My Bids',
  url: '/my-bids',
  icon: Briefcase
}, {
  title: 'Invoices',
  url: '/invoices',
  icon: FileText
}];
export function AppSidebar() {
  const {
    user,
    logout
  } = useAuth();
  const location = useLocation();
  if (!user) return null;
  const navItems = user.role === 'agent' ? agentNavItems : contractorNavItems;
  return <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg">H</div>
          <div>
            <h1 className="font-display text-xl font-bold text-sidebar-foreground">Handshake</h1>
            <p className="text-xs text-muted-foreground capitalize">{user.role} Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <Separator className="mx-3" />

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => {
              const isActive = location.pathname === item.url;
              return <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`mx-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-sidebar-accent text-sidebar-foreground'}`}>
                      <RouterNavLink to={item.url} className="flex items-center gap-3 px-4 py-2.5">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-secondary/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.companyName}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>;
}