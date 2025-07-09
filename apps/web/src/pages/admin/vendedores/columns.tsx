import type { ColumnDef } from "@tanstack/react-table"
import BadgeStatus from "@/components/badge-status";
import type { Usuario } from "@/gen";
import { AlterarStatus } from "./alterar-status";
import { Clientes } from "./clientes";
import { RedefinirSenha } from "./redefinir-senha";

export const columns: ColumnDef<Usuario>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "email",
        header: "Email",

    },{
        accessorKey: "telefone",
        header: "Telefone",
    },
    {
        accessorKey: "criado_em",
        header: "Data de Contratação",
        cell: ({ row }) => {
            const date = new Date(row.getValue<string>("criado_em"));
            return <div className="text-left">{date.toLocaleDateString()}</div>
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
        accessorKey: "id",
        header: () => <div className="text-center">Ações</div>,
        cell: ({ row }) =>
            <div className="flex justify-center">
                <Clientes id={row.getValue<string>("id")} />
                    <RedefinirSenha id={row.getValue<string>("id")}  />
                < AlterarStatus
                    id={row.getValue<string>("id")}
                    status={row.getValue<boolean>("ativo")}
                />
            </div>
    }
]