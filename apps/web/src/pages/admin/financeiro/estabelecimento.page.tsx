import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Filter } from "lucide-react";
import { useState } from "react";
import Combobox from "@/components/ui/combobox";
import { EstabelecimentoRecebiveis } from "./estabelecimeno-recebiveis";
import { useEstabelecimentosControllerFindAll } from "@/gen";

export function EstabelecimentoRecebiveisPage() {
  const { data, isLoading } = useEstabelecimentosControllerFindAll();
  const [estabelecimento, setEstabelecimento] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const clearFilters = () => {
    setEstabelecimento("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/*Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Financeiro
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Monitore e analise suas metricas financeiras
        </p>
      </div>
      {/*Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Filter className="h-5 w-5" /> Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Combobox
                label={"Estabelecimento"}
                emptyMessage=""
                searchPlaceholder="Procure por estabelecimentos"
                placeholder={""}
                data={
                  data?.data.map((e) => ({
                    label: e.social_reason,
                    value: `${e.id}`,
                  })) ?? []
                }
                onChange={setEstabelecimento}
                value={estabelecimento}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium">
                Data Inicial
              </Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="date"
                  className="pl-8 w-full"
                  value={startDate}
                  onChange={(e) => setStartDate(e.currentTarget.value)}
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium">
                Data Final
              </Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="date"
                  className="pl-8 w-full"
                  value={endDate}
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full bg-transparent"
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {estabelecimento && startDate && endDate && (
        <EstabelecimentoRecebiveis
          estabelecimento_id={estabelecimento}
          finish_date={endDate}
          start_date={startDate}
        />
      )}
    </div>
  );
}
