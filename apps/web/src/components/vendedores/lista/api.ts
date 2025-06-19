import { queryClient } from "@/lib/query-client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export type Vendedor = {
    id: string
    nome: string
    ativo: boolean
    email: string
    data_contratacao: string
    estabelecimentos: Array<{ id: number }>
}

// 1. A função que realmente busca os dados na API
async function getVendedores(): Promise<Vendedor[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/vendedores`);

    if (!response.ok) {
        throw new Error("Não foi possível buscar os vendedores.");
    }
    return response.json();
}

export function useVendedores() {
    return useQuery<Vendedor[], Error>({
        queryKey: ['vendedores'],
        queryFn: getVendedores,
    });
}

export function useUpdateStatusVendedor() {
    return useMutation<void, Error, { id: string, status: boolean }>({
        mutationFn: async (input: { id: string, status: boolean }) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/vendedores/${input.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ativo: input.status }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vendedores'] });
            toast.success(`Vendedor ${variables.status ? "ativado" : "desativado"} com sucesso!`);
        },
        onError: (error, variables) => {
            toast.error(error.message || `Erro ao ${variables.status ? "ativar" : "desativar"} vendedor.`);
        }
    })
}