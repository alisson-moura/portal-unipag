import { useAuth } from "../auth/auth-provider";
import { VendedorDashboardPage } from "./dashboard/vendedor";
import { AdminDashboard } from "./relatorios/admin/page";

export function DashboardPage() {
  const { user } = useAuth()

  if (!user)
    return <div>Carregando...</div>

  if (user.role == "ADMINISTRADOR")
    return <AdminDashboard />

  return <VendedorDashboardPage id={user.id} />
}