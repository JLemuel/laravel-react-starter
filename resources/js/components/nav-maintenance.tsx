"use client"

import {
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react"
import { Link, usePage } from '@inertiajs/react'
import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMaintenance({
  maintenance,
}: {
  maintenance: {
    name: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      name: string
      url: string
    }[]
  }[]
}) {
  const { isMobile } = useSidebar()
  const { url: currentUrl } = usePage()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Maintenance</SidebarGroupLabel>
      <SidebarMenu>
        {maintenance.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
            <Link 
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2 w-full hover:bg-muted transition-colors",
                    currentUrl === item.url && "bg-primary text-primary-foreground hover:!bg-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
