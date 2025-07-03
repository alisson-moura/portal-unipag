import type { Column, ColumnDef } from "@tanstack/react-table"
import BadgeStatus from "@/components/badge-status";
import { DataTable } from "@/components/ui/data-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCeoPagControllerEstabelecimentos, type EstabelecimentoCeoPagDto } from "@/gen";
import { AtribuirPara } from "./atribuir";

const statusOptions = [
    { value: "1", label: "Ativo", color: "green" },
    { value: "2", label: "Inativo", color: "red" },
]
export function StatusFilter({ column }: { column: Column<EstabelecimentoCeoPagDto, unknown> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="-ml-3 h-8">
                    Status
                    <MoreHorizontal className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-3">
                <DropdownMenuItem onSelect={() => column.setFilterValue(undefined)}>
                    Todos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onSelect={() => column.setFilterValue(option.value)}
                    >
                        <BadgeStatus color={option.color} status={option.label} />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const columns: ColumnDef<EstabelecimentoCeoPagDto>[] = [
    {
        accessorKey: "document_number",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    CPF/CNPJ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "social_reason",
        header: "Razão Social",

    },
    {
        accessorKey: "name",
        header: "Nome",

    },
    {
        accessorKey: "created_at",
        header: "Credenciado em",
    },
    {
        accessorKey: "status",
        header: ({ column }) => <StatusFilter column={column} />,
        enableGlobalFilter: false,
        cell: ({ row }) => {
            const status = row.getValue<number>("status")
            return <BadgeStatus
                color={status === 1 ? "green" : "red"}
                status={status === 1 ? "Ativo" : "Inativo"}
            />
        }
    },
    {
        accessorKey: "id",
        header: () => <div className="text-center">Ações</div>,
        enableGlobalFilter: false,
        cell: ({ row }) =>
            <div className="flex justify-center">
                <AtribuirPara
                    id={row.getValue<number>("id")}
                    nome={row.getValue<string>("name")}
                    razao_social={row.getValue<string>("social_reason")}
                    numero_documento={row.getValue<string>("document_number")}
                />
            </div>
    },
]

export function ListaEstabelecimentos() {
    const { data, isLoading } = useCeoPagControllerEstabelecimentos({ page: 1 })
    if (isLoading) {
        return <div>Carregando...</div>
    }

    return (
        <DataTable columns={columns} data={data?.data.data ?? []} />
    )
}