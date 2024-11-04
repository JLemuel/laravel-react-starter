"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  ClipboardList,
  FileText,
  Mail,
  List,
  UserCog,
  Book,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Logo from '../../images/logo.png'
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Main",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Dashboard",
           url: "#",
        },
        {
          title: "Violation Registry",
           url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Violation Report",
           url: "#",
        },
        {
          title: "Order of Payment",
           url: "#",
        },
      ],
    },
    {
      title: "Maintenance",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "List of Violation",
           url: "#",
        },
        {
          title: "Apprehending Officers",
           url: "#",
        },
        {
          title: "Booklet Inventory",
           url: "#",
        },
      ],
    },
   
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
