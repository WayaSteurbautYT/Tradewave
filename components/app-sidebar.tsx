"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Compass,
  FileCode,
  Home,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Upload,
  Users,
  Video,
  Wallet,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TokenDisplay } from "@/components/token-display"

export function AppSidebar() {
  const pathname = usePathname()
  const [tokens, setTokens] = useState(1250)

  const isActive = (path: string) => pathname === path

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Explore",
      icon: Compass,
      path: "/explore",
    },
    {
      title: "Launchpad",
      icon: Upload,
      path: "/upload",
    },
    {
      title: "WaveCast",
      icon: Video,
      path: "/live",
    },
    {
      title: "Projects",
      icon: FileCode,
      path: "/projects",
    },
    {
      title: "Marketplace",
      icon: Home,
      path: "/marketplace",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      path: "/messages",
    },
    {
      title: "WaveRiders",
      icon: Users,
      path: "/network",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Image src="/images/tradewave-logo.png" alt="TradeWave Logo" width={40} height={40} />
          <span className="text-xl font-bold text-teal-400">TradeWave</span>
          <SidebarTrigger className="ml-auto" />
        </div>
        <TokenDisplay tokens={tokens} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems && menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)} tooltip={item.title}>
                      <Link href={item.path}>
                        <item.icon className="text-teal-400" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="text-teal-400" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Create</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button className="w-full justify-start gap-2 bg-teal-500 hover:bg-teal-600">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">User Name</span>
                <span className="text-xs text-muted-foreground">Creator</span>
              </div>
              <Wallet className="ml-auto h-4 w-4 text-teal-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile" className="flex w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/wallet" className="flex w-full">
                Wallet
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings" className="flex w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
