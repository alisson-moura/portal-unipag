import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useRelatoriosControllerResumoBandeiras,
  useRelatoriosControllerResumoPeriodo,
  useRelatoriosControllerResumoTransacoes,
} from "@/gen";
import { formatCurrency } from "@/lib/format";
import { endOfDay, format, parseISO, startOfDay } from "date-fns";
import { CreditCard, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import ResumoTransacoesStatusChart from "./grafico-transacoes";
import { GraficoBandeiras } from "./grafico-bandeiras";
import { ResumoTransacoesStatusChartSkeleton } from "./grafico-transacoes-skeleton";
import { GraficoBandeirasSkeleton } from "./grafico-bandeiras-skeleton";

export function AdminDashboard() {
  const [range, setRange] = useState({
    start_date: format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"),
    finish_date: format(endOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"),
  });

  const { data: bandeiras, isLoading: banderiasLoading } =
    useRelatoriosControllerResumoBandeiras(range);
  const { data: periodo, isLoading: periodoLoading } =
    useRelatoriosControllerResumoPeriodo(range);
  const { data: transacoes } = useRelatoriosControllerResumoTransacoes(range);

  const handleStartDateChange = (date?: Date) => {
    if (date) {
      setRange((currentRange) => ({
        ...currentRange,
        start_date: format(startOfDay(date), "yyyy-MM-dd HH:mm:ss"),
      }));
    }
  };

  const handleFinishDateChange = (date?: Date) => {
    if (date) {
      setRange((currentRange) => ({
        ...currentRange,
        finish_date: format(endOfDay(date), "yyyy-MM-dd HH:mm:ss"),
      }));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* 3. Substituir o DatePickerWithRange pelos dois DatePicker individuais */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grid gap-2 w-full sm:w-auto">
            <Label htmlFor="start-date">Data Inicial</Label>
            <DatePicker
              id="start-date"
              placeholder="Data Inicial"
              date={parseISO(range.start_date)}
              onDateChange={handleStartDateChange}
            />
          </div>
          <div className="grid gap-2 w-full sm:w-auto">
            <Label htmlFor="finish-date">Data Final</Label>
            <DatePicker
              id="finish-date"
              placeholder="Data Final"
              date={parseISO(range.finish_date)}
              onDateChange={handleFinishDateChange}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Cards de Faturamento (sem alterações) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Faturamento Total
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {transacoes
                ? formatCurrency(transacoes.data.Faturamento.total.valor)
                : "---"}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {transacoes
                ? `${transacoes.data.Faturamento.total.qtde} transações`
                : "---"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Débito
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {transacoes
                ? formatCurrency(transacoes.data.Faturamento.debito.valor)
                : "---"}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {transacoes
                ? `${transacoes.data.Faturamento.debito.qtde} transações`
                : "---"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Crédito
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {transacoes
                ? formatCurrency(transacoes.data.Faturamento.credito.valor)
                : "---"}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {transacoes
                ? `${transacoes.data.Faturamento.credito.qtde} transações`
                : "---"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Parcelado
            </CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {transacoes
                ? formatCurrency(transacoes.data.Faturamento.parcelado.valor)
                : "---"}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {transacoes
                ? `${transacoes.data.Faturamento.parcelado.qtde} transações`
                : "---"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {periodoLoading && <ResumoTransacoesStatusChartSkeleton />}
        {periodo?.data && (
          <ResumoTransacoesStatusChart data={periodo?.data} period={range} />
        )}
        {banderiasLoading && <GraficoBandeirasSkeleton />}
        {bandeiras?.data && (
          <GraficoBandeiras data={bandeiras.data} period={range} />
        )}
      </div>
    </div>
  );
}
