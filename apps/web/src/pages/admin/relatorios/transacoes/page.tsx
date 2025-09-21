import { Separator } from "@/components/ui/separator";
import { useTransactionsReport } from "./hooks/use-transactions-report";
import { TransactionFilters } from "./components/filters";
import { TransactionsCards } from "./components/cards";
import { TransactionsList } from "./components/table";
import {
  TransactionCardsSkeleton,
  TransactionTableSkeleton,
} from "./components/loading";
import { parseISO } from "date-fns";

export function RelatorioTransacoes() {
  const {
    data,
    isLoading,
    isError,
    filters,
    handlePageChange,
    handleFromDateChange,
    handleToDateChange,
    handleMerchantChange,
  } = useTransactionsReport();

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
          currentToDate={currentDates.to}
          currentFromDate={currentDates.from}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
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
        <TransactionsList
          paginatedTransactions={data.transacoes}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
