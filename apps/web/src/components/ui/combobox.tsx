import { useId, useMemo, useState } from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxProps {
  label: string,
  placeholder: string,
  searchPlaceholder?: string, // Opcional: placeholder para a busca
  emptyMessage?: string,      // Opcional: mensagem quando não há resultados
  data: {
    label: string,
    value: string
  }[],
  // 1. A prop 'value' agora é uma string simples, que é mais comum para inputs de formulário.
  value?: string,
  // A prop 'onChange' agora é obrigatória para um componente controlado.
  onChange: (value: string) => void
  disabled?: boolean
}

export default function Combobox({
  label,
  placeholder,
  searchPlaceholder = "Buscar item...", // Valor padrão
  emptyMessage = "Nenhum item encontrado.", // Valor padrão
  data,
  value, // Recebe o valor diretamente como string
  onChange, // Recebe a função para notificar mudanças
  disabled
}: ComboboxProps) {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const selectedItem = data.find((item) => item.value === value);

  const filteredData = useMemo(() => {
    // Se não há termo de busca, retorna todos os dados.
    if (!searchTerm) return data;

    const lowercasedSearch = searchTerm.toLowerCase();

    return data.filter(
      (item) =>
        // A CONDIÇÃO CORRETA: busca no label OU no value.
        item.label.toLowerCase().includes(lowercasedSearch) ||
        item.value.toLowerCase().includes(lowercasedSearch)
    );
  }, [data, searchTerm])

  return (
    // Dica: 'space-y-2' é uma forma mais comum e legível de adicionar espaço entre os filhos.
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-3 font-normal" // Simplificado
          >
            {/* 3. Usamos o item encontrado a partir da prop 'value' para exibir o label. */}
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {selectedItem ? selectedItem.label : placeholder}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0" // Forma mais robusta de pegar a largura do gatilho
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredData.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(selectedValue) => {
                      // 4. A função 'onChange' da prop é chamada AQUI.
                      // Isso notifica o componente pai sobre a nova seleção.
                      onChange(selectedValue === value ? "" : selectedValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    {/* A verificação agora é feita contra a prop 'value' */}
                    {value === item.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}