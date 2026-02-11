"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, Video, Users, Gift } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Prodotti",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Ordini",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Clienti",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Live",
    href: "/admin/live",
    icon: Video,
  },
  {
    title: "Ruota Bonus",
    href: "/admin/wheel",
    icon: Gift,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border h-20 flex items-center">
        <h1 className="text-xl font-bold tracking-wider uppercase">Cave Admin</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-sidebar-accent/50 text-muted-foreground hover:text-sidebar-foreground transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Torna al Negozio</span>
        </Link>
      </div>
    </div>
  )
}
