import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import NumberInput from "@/components/ui/number-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Search, Loader2, AlertCircleIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useVendedorControllerFindAll, useVendedorControllerCriarIndicacao } from "@/gen"
import { queryClient } from "@/lib/query-client"

// 1. Definir o schema de validação com Zod e mensagens em pt-BR
const atribuirVendedorSchema = z.object({
  vendedorId: z.string({
    required_error: "Por favor, selecione um vendedor.",
  }),
  taxaComissao: z.number({
    required_error: "A taxa de comissão é obrigatória."
  })
    .min(0, "A taxa não pode ser negativa.")
    .max(100, "A taxa não pode ser maior que 100%.")
});

type AtribuirVendedorForm = z.infer<typeof atribuirVendedorSchema>;

export function AtribuirPara({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const { data: vendedoresData, isLoading } = useVendedorControllerFindAll();
  const { mutate, isPending, error } = useVendedorControllerCriarIndicacao({
    mutation: {
      onSuccess: () => {
        form.reset()
        setOpen(false)
        toast.success("Estabelecimento atríbuido com sucesso.")
        queryClient.invalidateQueries({ queryKey: ["estabelecimentos"] })
      }
    }
  })

  const form = useForm<AtribuirVendedorForm>({
    resolver: zodResolver(atribuirVendedorSchema),
    defaultValues: {
      taxaComissao: 20, // Valor padrão para a comissão
    },
  });

  const filteredVendedores = useMemo(() => {
    if (!vendedoresData?.data) return [];
    return vendedoresData.data.filter(vendedor =>
      vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendedoresData, searchTerm]);

  const onSubmit = (values: AtribuirVendedorForm) => {
    mutate({
      vendedorId: values.vendedorId,
      data: {
        taxa_comissao: values.taxaComissao,
        estabelecimento_id: id,
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="link">Atribuir</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Atribuir Estabelecimento
          </DialogTitle>
          <DialogDescription>
            Selecione um vendedor da lista e defina a taxa de comissão.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
            {/* Input de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendedor por nome ou e-mail..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <FormField
              control={form.control}
              name="vendedorId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Vendedor</FormLabel>
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
                        ) : filteredVendedores?.length ?? [].length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {filteredVendedores?.map((vendedor) => (
                              <FormItem key={vendedor.id} className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                                <FormControl>
                                  <RadioGroupItem value={vendedor.id} className="order-1 after:absolute after:inset-0" />
                                </FormControl>
                                <div className="grid grow gap-2">
                                  <FormLabel
                                    htmlFor={vendedor.id}
                                  >
                                    {vendedor.nome}
                                  </FormLabel>
                                  <p
                                    id={`${id}-1-description`}
                                    className="text-muted-foreground text-xs"
                                  >
                                    {vendedor.email}
                                  </p>
                                </div>
                              </FormItem>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-10">
                            Nenhum vendedor encontrado.
                          </div>
                        )}
                      </ScrollArea>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxaComissao"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <NumberInput
                      label="Taxa de Comissão (%)"
                      value={field.value}
                      onChange={field.onChange}
                      minValue={0}
                      maxValue={100}
                      step={5} defaultValue={0} name={"taxa_comissao"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-auto pt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atribuir
              </Button>
            </DialogFooter>
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Não atribuir o estabelecimento para o vendedor.</AlertTitle>
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