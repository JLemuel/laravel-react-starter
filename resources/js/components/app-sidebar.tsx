"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  FileStack,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  PersonStanding,
  Settings2,
  SquareTerminal,
  BookOpenText
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavReports } from "@/components/nav-report"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { NavMaintenance } from "@/components/nav-maintenance"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from '../../images/logo.png'
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
    {
      title: "Violation Registry",
      url: "#",
      icon: FileStack,
    },
  ],
  navSecondary: [
    {
      title: "Users",
      url: "/users",
      icon: LifeBuoy,
    },
    {
      title: "Roles",
      url: "/roles",
      icon: Send,
    },
  ],
  reports: [
    {
      name: "Violation Report",
      url: "#",
      icon: BookOpen,
    },
    {
      name: "Order of Payment",
      url: "#",
      icon: Send,
    },
  ],
  maintenance: [
    {
      name: "List of Violation",
      url: "/violations",
      icon: Settings2,
    },
    {
      name: "Apprehending Officers",
      url: "/apprehending-officers",
      icon: PersonStanding,
    },
    {
      name: "Booklet Inventory",
      url: "#",
      icon: BookOpenText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage<PageProps>().props;
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
            <Link href={route('dashboard')}>
                {/* <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div> */}
                <img
                  src={Logo}
                  alt="POVR Logo"
                  className="object-contain w-auto h-12"
                />
                {/* <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="text-4xl font-black truncate">POVR</span>
                  <span className="text-xs truncate">Enterprise</span>
                </div> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavReports reports={data.reports} />
        <NavMaintenance maintenance={data.maintenance} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
      <NavUser user={auth.user} />
      </SidebarFooter>
    </Sidebar>
  )
}