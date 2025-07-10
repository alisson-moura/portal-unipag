import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useUsuarioControllerAll } from '@/gen';
import { CadastrarVendedorForm } from './form-cadastro';

export function AdministradoresPage() {
    const { data } = useUsuarioControllerAll(
        {role: "ADMINISTRADOR"}, 
        { query: { queryKey: ["administradores"] } }
    )
    return (
        <div className="space-y-6">
            <div className='flex items-center justify-between'>
                <h1 className="text-xl font-bold">Administradores</h1>
                <CadastrarVendedorForm />
            </div>
            <DataTable columns={columns} data={data?.data ?? []} />
        </div>
    );
}

export default AdministradoresPage; 