import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "./lib/query-client"
import { ListaVendedores } from "./components/vendedores/lista"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 antialiased">
        <ListaVendedores/>
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App