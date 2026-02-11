import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
       <aside className="hidden md:block w-64 border-r border-sidebar-border bg-sidebar sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
         <AdminSidebar />
       </aside>
       <main className="flex-1 p-6 md:p-8 bg-background">
         {children}
       </main>
    </div>
  )
}
