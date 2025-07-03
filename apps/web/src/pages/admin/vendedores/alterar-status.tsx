import { Button } from "@/components/ui/button";
import { useUsuarioControllerAlterarStatus } from "@/gen";
import { queryClient } from "@/lib/query-client";

export function AlterarStatus({ id, status }: { id: string; status: boolean }) {
    const { mutate, isPending } = useUsuarioControllerAlterarStatus({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries({queryKey: ["vendedores"]})
            },
        }
    })

    const handleToggle = () => {
        mutate({id, data: {ativo: !status}});
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