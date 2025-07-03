import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useVendedorControllerAll } from '@/gen';
import { CadastrarVendedorForm } from './form-cadastro';

export function VendedoresPage() {
    const { data } = useVendedorControllerAll({ page: 1 }, { query: { queryKey: ["vendedores"] } })
    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between'>
                <h1 className="text-xl font-bold">Vendedores</h1>
                <CadastrarVendedorForm />
            </div>
            <DataTable columns={columns} data={data?.data.results ?? []} />
        </div>
    );
}

export default VendedoresPage; 