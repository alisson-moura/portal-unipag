import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { useState } from "react";
import { VendedorRecebiveis } from "./vendedor-recebiveis";
import { useVendedorControllerAll } from "@/gen";

export function VendedorRecebiveisPage() {
  const { data, isLoading } = useVendedorControllerAll({ page: 1 })
  const [seller, setSeller] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const clearFilters = () => {
    setSeller("")
    setStartDate("")
    setEndDate("")
  }


  return (
    <div className="space-y-6">
      {/*Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-600">Monitore e analise suas metricas financeiras</p>
      </div>
      {/*Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 w-full items-end">
            <div className="space-y-2 md:col-span-2 lg:col-span-2">
              <Label htmlFor="seller-select">Vendedor</Label>
              <Select value={seller} onValueChange={setSeller}>
                <SelectTrigger disabled={isLoading} id="seller-select" className="w-[350px]">
                  <SelectValue placeholder="Escolha o vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {data?.data.results?.map(vendedor => <SelectItem key={vendedor.id} value={`${vendedor.id}`}>{vendedor.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Data Inicial</Label>
              <div className="relative">
                <Input id="start-date" type="date" className="pl-8 w-full" value={startDate} onChange={(e) => setStartDate(e.currentTarget.value)} />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Data Final</Label>
              <div className="relative">
                <Input id="end-date" type="date" className="pl-8 w-full" value={endDate} onChange={(e) => setEndDate(e.currentTarget.value)} />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters} className="w-full lg:w-auto">
              Limpar filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      {seller && startDate && endDate && <VendedorRecebiveis vendedor_id={seller} finish_date={endDate} start_date={startDate} />}
    </div>
  );
}

