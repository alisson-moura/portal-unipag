"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Definimos as props que o componente vai aceitar
export type DatePickerProps = {
  date?: Date;
  onDateChange: (date?: Date) => void;
  placeholder?: string;
  id?: string; // Para acessibilidade, ligando a Label ao botão
};

export function DatePicker({
  date,
  onDateChange,
  placeholder,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          id={id}
          className={cn(
            "w-full justify-start text-left font-normal", // Removido o tamanho fixo
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd/MM/yyyy", { locale: ptBR })
          ) : (
            <span>{placeholder || "Selecione uma data"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={date} // Usa a data vinda das props
          onSelect={(selectedDate) => {
            onDateChange(selectedDate); // Notifica o componente pai sobre a mudança
            setOpen(false); // Fecha o popover ao selecionar
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
