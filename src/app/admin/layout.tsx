'use client'

import { Sidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-base">
      <Sidebar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  )
}
