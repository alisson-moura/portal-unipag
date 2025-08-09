import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { useEstabelecimentosControllerRemoverGestor } from "../../../gen";
import { queryClient } from "../../../lib/query-client";
import { toast } from "sonner";
import { Separator } from "../../../components/ui/separator";

export function RemoverGestor({ id }: { id: string }) {
  const { mutate, isPending } = useEstabelecimentosControllerRemoverGestor({
    mutation: {
      onSuccess: () => {
        toast.success("Gestor removido com sucesso.");
        queryClient.invalidateQueries({ queryKey: ["estabelecimentos"] });
      },
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-red-600 hover:text-red-800"
        >
          <Separator orientation="vertical" />
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover Gestor</AlertDialogTitle>
          <AlertDialogDescription>
            Ao remover o gestor, ele não poderá mais visualizar as transações
            deste estabelecimento. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate({ id })}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Removendo..." : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
