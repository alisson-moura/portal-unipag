import { Button } from "@/components/ui/button";
import { useUsuarioControllerAlterarStatus } from "@/gen";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";

export function AlterarStatus({ id, status }: { id: string; status: boolean }) {
    const { mutate, isPending } = useUsuarioControllerAlterarStatus({
        mutation: {
            onSuccess() {
                toast.success(
                    `Vendedor ${status ? "desativado" : "ativado"} com sucesso!`
                );
                queryClient.invalidateQueries({ queryKey: ["vendedores"] })
            },
            onError(error) {
                toast.error(error.response?.data.message);
            }
        }
    })

    const handleToggle = () => {
        mutate({ id, data: { ativo: !status } });
    };

    return (
        <Button
            size="sm"
            onClick={handleToggle}
            variant="link"
            className={`text-${status ? "destructive" : "primary"}`}
            disabled={isPending}
        >
            {status ? "Desativar" : "Ativar"}
        </Button>
    );
}