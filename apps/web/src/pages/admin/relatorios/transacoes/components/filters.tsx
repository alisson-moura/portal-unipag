import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { useEstabelecimentosControllerFindAll } from "@/gen";
import { X } from "lucide-react";

type TransactionFiltersProps = {
  currentDates: { from: Date; to: Date };
  onDateChange: (dates: { from: Date; to: Date }) => void;
  currentMid?: string;
  onMerchantChange: (id: string) => void;
};

export function TransactionFilters({
  currentDates,
  onDateChange,
  onMerchantChange,
  currentMid,
}: TransactionFiltersProps) {
  const { data, isLoading } = useEstabelecimentosControllerFindAll();

  return (
    <div className="flex flex-col sm:flex-row sm:flex-1 sm:justify-end sm:items-end gap-3 sm:gap-4 w-full">
      <div className="grid gap-2 w-full sm:w-auto">
        <Label>Período</Label>
        <DatePickerWithRange
          date={currentDates}
          onDateChange={(range) =>
            range &&
            onDateChange({
              from: range.from!,
              to: range.to!,
            })
          }
        />
      </div>

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
