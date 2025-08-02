import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Percent } from "lucide-react";
import { format } from "date-fns";
import {
  useConfiguracoesControllerGetTaxaAdministrativa,
  useConfiguracoesControllerPutTaxaAdministrativa,
} from "@/gen";

export function ConfigPage() {
  const { data, isLoading: getConfigsIsLoading } =
    useConfiguracoesControllerGetTaxaAdministrativa();

  const { isPending, mutate } = useConfiguracoesControllerPutTaxaAdministrativa(
    {
      mutation: {
        onSuccess: () => {
          toast.success("Configurações salvas", {
            description:
              "A taxa administrativa Unipag foi atualizada com sucesso.",
            position: "top-right",
          });
        },
        onError: () => {
          toast.error("Erro ao salvar configurações", {
            description:
              "Ocorreu um erro ao salvar as configurações. Tente novamente.",
            position: "top-right",
          });
        },
      },
    }
  );

 
  const [taxaInput, setTaxaInput] = useState("");

  const decimalParaPorcentagem = (decimal: number): string => {
    return (decimal * 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  const porcentagemParaDecimal = (porcentagem: string): number => {
    const numeroLimpo = porcentagem.replace(",", ".");
    return Number.parseFloat(numeroLimpo) / 100;
  };

  React.useEffect(() => {
    if (data?.data.taxa_administrativa.taxa !== undefined) {
      setTaxaInput(decimalParaPorcentagem(data.data.taxa_administrativa.taxa));
    }
  }, [data]);

  const handleSalvar = () => {
    const taxaDecimal = porcentagemParaDecimal(taxaInput);

    mutate({
      data: {
        taxa: taxaDecimal,
      },
      id: data?.data.taxa_administrativa.id ?? "",
    });
  };

  const handleTaxaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*[,.]?\d*$/.test(value)) {
      setTaxaInput(value);
    }
  };

  if (getConfigsIsLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">
              Carregando configurações...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do painel administrativo
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              <CardTitle>Taxa Administrativa Unipag</CardTitle>
            </div>
            <CardDescription>
              Configure a taxa administrativa aplicada nas transações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="taxa-unipag">Taxa (%)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="taxa-unipag"
                  type="text"
                  value={taxaInput}
                  onChange={handleTaxaChange}
                  placeholder="0,00"
                  className="max-w-xs"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Taxa atual:{" "}
                {data?.data.taxa_administrativa.taxa
                  ? decimalParaPorcentagem(data.data.taxa_administrativa.taxa)
                  : "0,00"}
                % - Será aplicada em todas as transações
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Última atualização:{" "}
                {format(
                  data?.data.taxa_administrativa.atualizado_em ?? new Date(),
                  "dd/MM/yyyy HH:mm"
                )}
              </div>
              <Button
                onClick={handleSalvar}
                disabled={isPending || !taxaInput}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ConfigPage;
