import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Search,
  Loader2,
  AlertCircleIcon,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useUsuarioControllerAll,
  useEstabelecimentosControllerAtribuirGestor,
} from "@/gen";
import { queryClient } from "@/lib/query-client";

// 1. Schema de validação para atribuir gestor
const atribuirGestorSchema = z.object({
  gestorId: z.string({
    required_error: "Por favor, selecione um gestor.",
  }),
});

type AtribuirGestorForm = z.infer<typeof atribuirGestorSchema>;

export function AtribuirGestor({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: gestoresData, isLoading } = useUsuarioControllerAll({
    role: "GESTOR",
  });
  const { mutate, isPending, error } =
    useEstabelecimentosControllerAtribuirGestor({
      mutation: {
        onSuccess: () => {
          form.reset();
          setOpen(false);
          toast.success("Gestor atribuído com sucesso.");
          queryClient.invalidateQueries({ queryKey: ["estabelecimentos"] });
        },
      },
    });

  const form = useForm<AtribuirGestorForm>({
    resolver: zodResolver(atribuirGestorSchema),
  });

  const filteredGestores = useMemo(() => {
    if (!gestoresData?.data) return [];
    return gestoresData.data.filter(
      (gestor) =>
        gestor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gestor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [gestoresData, searchTerm]);

  const onSubmit = (values: AtribuirGestorForm) => {
    mutate({
      data: { estabelecimentoId: id, gestorId: values.gestorId },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Atribuir Gestor ao Estabelecimento
          </DialogTitle>
          <DialogDescription>
            Selecione um gestor da lista para gerenciar este estabelecimento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex-1 flex flex-col"
          >
            {/* Input de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar gestor por nome ou e-mail..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <FormField
              control={form.control}
              name="gestorId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Gestor</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="gap-2"
                    >
                      <ScrollArea className="h-[250px] w-full pr-4">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : filteredGestores.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {filteredGestores.map((gestor) => (
                              <FormItem
                                key={gestor.id}
                                className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={gestor.id}
                                    className="order-1 after:absolute after:inset-0"
                                  />
                                </FormControl>
                                <div className="grid grow gap-2">
                                  <FormLabel htmlFor={gestor.id}>
                                    {gestor.nome}
                                  </FormLabel>
                                  <p
                                    id={`${id}-1-description`}
                                    className="text-muted-foreground text-xs"
                                  >
                                    {gestor.email}
                                  </p>
                                </div>
                              </FormItem>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-10">
                            Nenhum gestor encontrado.
                          </div>
                        )}
                      </ScrollArea>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-auto pt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atribuir
              </Button>
            </DialogFooter>

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Não foi possível atribuir o gestor.</AlertTitle>
                <AlertDescription>
                  <p>{error.response?.data.message}</p>
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
