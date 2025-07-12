
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Cable,
  Inbox,
  LogOut,
  Map,
  Plane,
  Settings,
  Siren,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/itinerary', icon: Plane, label: 'Itinerary' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/inbox', icon: Inbox, label: 'Inbox' },
  { href: '/connections', icon: Cable, label: 'Connections' },
  { href: '/alerts', icon: Siren, label: 'Alerts' },
  { href: '/ai', icon: Sparkles, label: 'Ask Voyage AI' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Sparkles className="h-5 w-5" />
            </Button>
            <span className="font-headline text-lg font-semibold">
              Voyage AI
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    as="a"
                    isActive={isClient ? pathname.startsWith(item.href) : false}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person face" alt="User" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Seasoned Traveler</span>
                <span className="text-xs text-muted-foreground">
                  pro@voyage.ai
                </span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:hidden">
          <Link href="/itinerary" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-headline text-lg font-semibold">
              Voyage AI
            </span>
          </Link>
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <nav className="fixed bottom-0 z-10 w-full border-t bg-background/80 backdrop-blur-sm md:hidden">
          <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center justify-center gap-1 px-2">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-none text-xs ${
                  isClient && pathname.startsWith(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        {/* Spacer for bottom nav */}
        <div className="h-16 md:hidden" />
      </SidebarInset>
    </SidebarProvider>
  );
}
