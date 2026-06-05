import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-bg-base">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  )
}
