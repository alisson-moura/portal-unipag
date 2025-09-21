import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker"; // Alterado
import { Label } from "@/components/ui/label";
import { useEstabelecimentosControllerFindAll } from "@/gen";
import { X } from "lucide-react";

// Props atualizadas para aceitar datas individuais
type TransactionFiltersProps = {
  currentFromDate?: Date;
  onFromDateChange: (date?: Date) => void;
  currentToDate?: Date;
  onToDateChange: (date?: Date) => void;
  currentMid?: string;
  onMerchantChange: (id: string) => void;
};

export function TransactionFilters({
  currentFromDate,
  onFromDateChange,
  currentToDate,
  onToDateChange,
  onMerchantChange,
  currentMid,
}: TransactionFiltersProps) {
  const { data, isLoading } = useEstabelecimentosControllerFindAll();

  return (
    <div className="flex flex-col sm:flex-row sm:flex-1 sm:justify-end sm:items-end gap-3 sm:gap-4 w-full">
      {/* Input para Data Inicial */}
      <div className="grid gap-2 w-full sm:w-auto">
        <Label htmlFor="from-date">Data Inicial</Label>
        <DatePicker
          id="from-date"
          date={currentFromDate}
          onDateChange={onFromDateChange}
        />
      </div>

      {/* Input para Data Final */}
      <div className="grid gap-2 w-full sm:w-auto">
        <Label htmlFor="to-date">Data Final</Label>
        <DatePicker
          id="to-date"
          date={currentToDate}
          onDateChange={onToDateChange}
        />
      </div>

      {/* Combobox de Estabelecimento (sem alterações) */}
      <div className="flex items-end gap-2 w-full sm:w-auto sm:min-w-[300px] lg:min-w-[350px]">
        <div className="flex-1 w-full">
          <Combobox
            label={"Estabelecimento"}
            emptyMessage=""
            searchPlaceholder="Procure por estabelecimentos"
            placeholder={""}
            data={
              data?.data.map((e) => ({
                label: e.name,
                value: `${e.ceo_pag_id}`,
              })) ?? []
            }
            onChange={onMerchantChange}
            value={currentMid}
            disabled={isLoading}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => onMerchantChange("")}
        >
          <X className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
