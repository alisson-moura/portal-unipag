import { Separator } from "@/components/ui/separator";
import { useTransactionsGestorReport } from "./use-relatorio-gestor";
import { parseISO } from "date-fns";
import { TransactionFilters } from "../transacoes/components/filters";
import {
  TransactionCardsSkeleton,
  TransactionTableSkeleton,
} from "../transacoes/components/loading";
import { TransactionsGestorList } from "./table";
import { TransactionsCards } from "../transacoes/components/cards";

export function RelatorioGertorTransacoes() {
  const {
    data,
    isLoading,
    isError,
    filters,
    handleDateChange,
    handleMerchantChange,
  } = useTransactionsGestorReport();

  const currentDates = {
    from: parseISO(filters.startDate),
    to: parseISO(filters.finishDate),
  };

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Ocorreu um erro ao buscar os dados.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Relatório de Transações</h1>
        <TransactionFilters
          currentDates={currentDates}
          onDateChange={handleDateChange}
          onMerchantChange={handleMerchantChange}
          currentMid={`${filters.mid}`}
        />
      </div>

      <Separator />

      {isLoading || !data ? (
        <TransactionCardsSkeleton />
      ) : (
        <TransactionsCards contador={data.contador} />
      )}

      {isLoading || !data ? (
        <TransactionTableSkeleton />
      ) : (
        <TransactionsGestorList transactions={data.data} />
      )}
    </div>
  );
}
