import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/format";
import type { DailyTotal } from "@/gen";

const columns: ColumnDef<DailyTotal>[] = [
    {
        accessorKey: "data_recebimento",
        header: "Data recebimento"
    },
    {
        accessorFn: (row) => row.tpv,
        header: "Valor Bruto (TPV)",
        cell: ({ row }) => {
            return <div className="text-left">{formatCurrency(row.original.tpv)}</div>
        }
    },
    {
        accessorFn: (row) => row.mdr,
        header: "Taxa administrativa (MDR)",
        cell: ({ row }) => {
            return <div className="text-left">{formatCurrency(row.original.mdr)}</div>
        }
    },
    {
        accessorFn: (row) => row.rav,
        header: "RAV",
        cell: ({ row }) => {
            return <div className="text-left">{formatCurrency(row.original.rav)}</div>
        }
    },
    {
        accessorFn: (row) => row.liquido,
        header: "Valor Liquído",
        cell: ({ row }) => {
            return <div className="text-left">{formatCurrency(row.original.liquido)}</div>
        }
    },
]

export function ListaEstabelecimentoRecebimentos({ data }: { data: DailyTotal[] }) {
    return (
        <DataTable columns={columns} data={data} />
    )
}