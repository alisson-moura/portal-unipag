import { useVendedores } from "./api";
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

export function ListaVendedores() {
    const { data, isLoading } = useVendedores();

    if (isLoading) {
        return <div>Carregando...</div>
    }

    return (
        <DataTable columns={columns} data={data ?? []} />
    )
}