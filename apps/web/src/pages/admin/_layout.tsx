import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/auth-provider';

export function AdminLayout() {
  const {isAuthenticated} = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
}

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout; // Exporte como default também