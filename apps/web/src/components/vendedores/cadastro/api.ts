import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

export const cadastrarVendedorInputSchema = z.object({
    nome: z.string().min(2, {
        message: "O nome precisa ter ao menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Endereço de e-mail inválido.",
    }),
});
export type CadastrarVendedorInput = z.infer<typeof cadastrarVendedorInputSchema>;

export function useCadastrarVendedor() {
    return useMutation<void, Error, CadastrarVendedorInput>({
        mutationFn: async (data: CadastrarVendedorInput) => {
           const response = await fetch(`${import.meta.env.VITE_API_URL}/vendedores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao cadastrar vendedor.");
            }
        },
        onSuccess: () => {
            toast.success("Vendedor cadastrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ['vendedores'] });
        },
    })
}