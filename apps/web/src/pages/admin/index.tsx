import { useAuth } from "../auth/auth-provider";
import { AdminDashboardPage } from "./dashboard/admin";
import { VendedorDashboardPage } from "./dashboard/vendedor";

export function DashboardPage() {
  const { user } = useAuth()

  if (!user)
    return <div>Carregando...</div>

  if (user.role == "ADMINISTRADOR")
    return <AdminDashboardPage />

  return <VendedorDashboardPage id={user.id} />
}