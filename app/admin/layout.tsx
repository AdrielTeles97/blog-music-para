import { Sidebar } from "@/components/sidebar";
import { useAdminProtection } from "@/lib/hooks/use-admin-protection";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
