import type { Column, ColumnDef } from "@tanstack/react-table";
import BadgeStatus from "@/components/badge-status";
import { DataTable } from "@/components/ui/data-table";
import { ArrowUpDown, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AtribuirPara } from "./atribuir";
import {
  useEstabelecimentosControllerFindAll,
  type EstabelecimentoDto,
} from "@/gen";
import { AtribuirGestor } from "./gestor";
import { RemoverGestor } from "./remover-gestor";

const statusOptions = [
  { value: "1", label: "Ativo", color: "green" },
  { value: "2", label: "Inativo", color: "red" },
];
export function StatusFilter({
  column,
}: {
  column: Column<EstabelecimentoDto, unknown>;
}) {
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
  );
}

const columns: ColumnDef<EstabelecimentoDto>[] = [
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
      );
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
    header: "Gestor",
    cell: ({ row }) => {
      const gestor = row.original.gestor;

      if (gestor) {
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{gestor.nome}</span>
              <span className="text-xs text-muted-foreground">
                {gestor.email}
              </span>
            </div>
            <RemoverGestor id={row.original.id} />
          </div>
        );
      }

      return <AtribuirGestor id={row.original.id} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <StatusFilter column={column} />,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const status = row.getValue<number>("status");
      return (
        <BadgeStatus
          color={status === 1 ? "green" : "red"}
          status={status === 1 ? "Ativo" : "Inativo"}
        />
      );
    },
  },
  {
    accessorKey: "id",
    header: () => <div className="text-center">Ações</div>,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const isAtribuida = row.original.indicacao != null;
      if (isAtribuida) return null;
      return (
        <div className="flex justify-center">
          <AtribuirPara id={row.getValue<string>("id")} />
        </div>
      );
    },
  },
];

export function ListaEstabelecimentos() {
  const { data, isLoading } = useEstabelecimentosControllerFindAll({
    query: {
      queryKey: ["estabelecimentos"],
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return <DataTable columns={columns} data={data?.data ?? []} />;
}
