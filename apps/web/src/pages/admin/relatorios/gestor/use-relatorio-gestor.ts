import z from "zod";
import { useSearchParams } from "react-router-dom";
import { endOfDay, format, startOfDay } from "date-fns";
import { useRelatoriosControllerTransacoesPorGestor } from "../../../../gen";
import { useMemo } from "react";

const filtersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  startDate: z
    .string()
    .default(format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss")),
  finishDate: z
    .string()
    .default(format(endOfDay(new Date()), "yyyy-MM-dd HH:mm:ss")),
  mid: z.string().optional(),
});

export function useTransactionsGestorReport() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return filtersSchema.parse(params);
  }, [searchParams]);

  const { data, isLoading, isError } =
    useRelatoriosControllerTransacoesPorGestor({
      page: filters.page,
      start_date: filters.startDate,
      finish_date: filters.finishDate,
      mid: filters.mid ? parseInt(filters.mid) : undefined,
    });

  const updateFilters = (
    newFilters: Partial<z.infer<typeof filtersSchema>>
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    const shouldResetPage = Object.keys(newFilters).some(
      (key) => key !== "page"
    );
    if (shouldResetPage) {
      newSearchParams.set("page", "1");
    }

    setSearchParams(newSearchParams);
  };

  const handleMerchantChange = (mid: string) => {
    updateFilters({
      mid,
    });
  };

  const handleDateChange = (dateRange: { from: Date; to: Date }) => {
    updateFilters({
      startDate: format(startOfDay(dateRange.from), "yyyy-MM-dd HH:mm:ss"),
      finishDate: format(endOfDay(dateRange.to), "yyyy-MM-dd HH:mm:ss"),
    });
  };

  return {
    data: data?.data,
    isLoading,
    isError,
    filters,
    handleDateChange,
    handleMerchantChange,
  };
}
