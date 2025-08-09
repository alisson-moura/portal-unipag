import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useUsuarioControllerAll } from "@/gen";
import { CadastrarVendedorForm } from "./form-cadastro";

export function AdministradoresPage() {
  const { data } = useUsuarioControllerAll(
    {},
    { query: { queryKey: ["usuarios"] } }
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Usuários</h1>
        <CadastrarVendedorForm />
      </div>
      <DataTable columns={columns} data={data?.data ?? []} />
    </div>
  );
}

export default AdministradoresPage;
