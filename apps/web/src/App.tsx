import { QueryClientProvider } from "@tanstack/react-query"
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/query-client"
import AdminLayout from "./pages/admin/_layout";
import VendedoresPage from "./pages/admin/vendedores/page"
import EstabelecimentosPage from "./pages/admin/estabelecimentos/estabelecimentos.page";
import { VendedorRecebiveisPage } from "./pages/admin/financeiro/vendedor.page";
import { EstabelecimentoRecebiveisPage } from "./pages/admin/financeiro/estabelecimento.page";
import { LoginPage } from "./pages/auth/login";
import { DashboardPage } from "./pages/admin/index";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="financeiro/vendedores" element={<VendedorRecebiveisPage />} />
          <Route path="financeiro/estabelecimentos" element={<EstabelecimentoRecebiveisPage />} />
          <Route path="vendedores" element={<VendedoresPage />} />
          <Route path="estabelecimentos" element={<EstabelecimentosPage />} />
        </Route>
      </Routes>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App