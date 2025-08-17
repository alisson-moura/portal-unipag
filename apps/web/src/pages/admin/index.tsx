import { useAuth } from "../auth/auth-provider";
import { AdminDashboardPage } from "./dashboard/admin/admin";
import { VendedorDashboardPage } from "./dashboard/vendedor";
import { RelatorioGertorTransacoes } from "./relatorios/gestor/page";

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return <div>Carregando...</div>;

  if (user.role == "ADMINISTRADOR") return <AdminDashboardPage />;

  if (user.role == "GESTOR") return <RelatorioGertorTransacoes />;

  return <VendedorDashboardPage id={user.id} />;
}
