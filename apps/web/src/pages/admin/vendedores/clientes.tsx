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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Building2, Search, X, Minus } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import NumberInput from "@/components/ui/number-input"
import { useVendedorControllerAlterarTaxaComissao, useVendedorControllerDesatribuirEstabelecimento, useVendedorControllerEstabelecimentosAtribuidosPara } from "@/gen"
import { queryClient } from "@/lib/query-client"

export function Clientes({ id }: { id: string }) {
  const { data, isLoading, isRefetching } = useVendedorControllerEstabelecimentosAtribuidosPara(id, { page: 1 }, { query: { queryKey: ["estabelecimentos-atribuidos", id] } })
  const { mutate, isPending } = useVendedorControllerDesatribuirEstabelecimento({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['estabelecimentos-atribuidos', variables.id] });
      }
    }
  })
  const { mutate: mutateTaxaComissao, isPending: isPendingTaxaComissao } = useVendedorControllerAlterarTaxaComissao({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['estabelecimentos-atribuidos', variables.vendedor_id] });
      }
    }
  })
  const [searchTerm, setSearchTerm] = useState("")

  const estabelecimentosFiltrados = data?.data.results?.filter(
    (estabelecimento) =>
      estabelecimento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estabelecimento.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estabelecimento.numero_documento.includes(searchTerm),
  )

  const handleDesatribuir = (estabelecimentoId: number) => {
    console.log(`Desatribuindo estabelecimento ${estabelecimentoId} ao vendedor ${id}`)
    mutate({ estabelecimento_id: estabelecimentoId, id });
  }

  const handleChangeTaxaComissao = (estabelecimento_id: number, taxa_comissao: number) => {
    console.log(`Alterando taxa de comissão do estabelecimento ${estabelecimento_id} para ${taxa_comissao}%`)
    mutateTaxaComissao({
      estabelecimento_id,
      vendedor_id: id,
      data: {
        taxa_comissao
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="link">Clientes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Estabelecimentos Atribuídos
          </DialogTitle>
          <DialogDescription>Todos os clientes do vendedor.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome, razão social ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando estabelecimentos...</p>
          </div>
        ) : estabelecimentosFiltrados?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum estabelecimento encontrado</p>
            <p className="text-sm">Tente ajustar os termos da busca</p>
          </div>
        ) :
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {data?.data.results?.map((estabelecimento, index) => (
                <div key={estabelecimento.estabelecimento_id}>
                  <div className="flex items-start justify-between space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm leading-none">{estabelecimento.nome}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{estabelecimento.razao_social}</p>
                      <p className="text-xs font-mono text-muted-foreground">{estabelecimento.numero_documento}</p>
                    </div>
                    <div className="w-[140px]">
                      <Button size="sm" disabled={isRefetching || isPending || isPendingTaxaComissao} onClick={() => handleDesatribuir(estabelecimento.estabelecimento_id)} className="shrink-0 w-full">
                        <Minus className="h-4 w-4 mr-1" />
                        Desatribuir
                      </Button>
                      <NumberInput
                        disabled={isPendingTaxaComissao || isRefetching || isPending}
                        defaultValue={estabelecimento.taxa_comissao}
                        minValue={5}
                        maxValue={100}
                        step={5}
                        label="Taxa de Comissão (%)"
                        name={"taxa_comissao"}
                        onChange={(value: number) => handleChangeTaxaComissao(estabelecimento.estabelecimento_id, value)}
                      />
                    </div>
                  </div>
                  {estabelecimentosFiltrados && index < estabelecimentosFiltrados.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
              {estabelecimentosFiltrados?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum estabelecimento encontrado</p>
                  <p className="text-sm">Tente ajustar os termos da busca</p>
                </div>
              )}
            </div>
          </ScrollArea>
        }

        <DialogFooter className="flex justify-center">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
