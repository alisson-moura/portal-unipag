import type { ColumnDef } from "@tanstack/react-table"
import { type Vendedor } from "./api"
import BadgeStatus from "@/components/badge-status";
import { ToggleStatus } from "./toggle-status";

export const columns: ColumnDef<Vendedor>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",

    },
    {
        accessorKey: "data_contratacao",
        header: "Data de Contratação",
        cell: ({ row }) => {
            const date = new Date(row.getValue<string>("data_contratacao"));
            return <div className="text-center">{date.toLocaleDateString()}</div>
        }
    },
    {
        accessorKey: "ativo",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue<boolean>("ativo") ? "Ativo" : "Inativo";
            return <BadgeStatus
                color={status === "Ativo" ? "green" : "red"}
                status={status}
            />
        }
    },
    {
        accessorKey: "estabelecimentos",
        header: "Estabelecimentos",
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue<[]>("estabelecimentos").length}</div>
        }
    },
    {
        accessorKey: "id",
        header: "Ações",
        cell: ({ row }) =>
            <ToggleStatus id={row.getValue<string>("id")} status={row.getValue<boolean>("ativo")} />
    }
]