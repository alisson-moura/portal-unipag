import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useUsuarioControllerAll } from '@/gen';
import { CadastrarVendedorForm } from './form-cadastro';

export function VendedoresPage() {
    const { data } = useUsuarioControllerAll(
            {role: "VENDEDOR"}, 
            { query: { queryKey: ["vendedores"] } }
        )
    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between'>
                <h1 className="text-xl font-bold">Vendedores</h1>
                <CadastrarVendedorForm />
            </div>
            <DataTable columns={columns} data={data?.data ?? []} />
        </div>
    );
}

export default VendedoresPage; 