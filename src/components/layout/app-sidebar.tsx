
'use client';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Vote, LayoutDashboard, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <>
      <SidebarHeader>
        <div className="flex h-10 items-center justify-between">
          <div
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
            hidden={state === 'collapsed'}
          >
            <Vote className="size-6 shrink-0" />
            <span className="text-lg font-semibold">VoterKit</span>
          </div>
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive
              tooltip={{
                children: 'Dashboard',
              }}
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
