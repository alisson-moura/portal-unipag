import { QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "./pages/admin/_layout";
import VendedoresPage from "./pages/admin/vendedores/page";
import EstabelecimentosPage from "./pages/admin/estabelecimentos/estabelecimentos.page";
import { VendedorRecebiveisPage } from "./pages/admin/financeiro/vendedor.page";
import { EstabelecimentoRecebiveisPage } from "./pages/admin/financeiro/estabelecimento.page";
import { LoginPage } from "./pages/auth/login";
import { DashboardPage } from "./pages/admin/index";
import AdministradoresPage from "./pages/admin/administradores/page";
import { RelatorioTransacoes } from "./pages/admin/relatorios/transacoes/page";
import { ConfigPage } from "./pages/admin/configs/page";
import { AdminDashboard } from "./pages/admin/relatorios/admin/page";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="financeiro/vendedores"
            element={<VendedorRecebiveisPage />}
          />
          <Route
            path="financeiro/estabelecimentos"
            element={<EstabelecimentoRecebiveisPage />}
          />
          <Route path="vendedores" element={<VendedoresPage />} />
          <Route path="administradores" element={<AdministradoresPage />} />
          <Route path="estabelecimentos" element={<EstabelecimentosPage />} />
          <Route
            path="relatorios/transacoes"
            element={<RelatorioTransacoes />}
          />
          <Route
            path="relatorios/transacoes/resumo"
            element={<AdminDashboard />}
          />
          <Route path="configs" element={<ConfigPage />} />
        </Route>
      </Routes>
      <Toaster richColors />
    </QueryClientProvider>
  );
}

export default App;
