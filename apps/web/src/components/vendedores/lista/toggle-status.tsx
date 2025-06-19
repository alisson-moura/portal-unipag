import { Button } from "@/components/ui/button";
import {useUpdateStatusVendedor } from "./api";

export function ToggleStatus({ id, status }: { id: string; status: boolean }) {
    const { mutate, isPending } =  useUpdateStatusVendedor()

    const handleToggle = () => {
        mutate({id, status: !status});
    };

    return (
        <Button
            onClick={handleToggle}
            variant="link"
            className={`text-${status ? "destructive" : "primary"}`}
            disabled={isPending}
        >
            {status ? "Desativar" : "Ativar"}
        </Button>
    );
}