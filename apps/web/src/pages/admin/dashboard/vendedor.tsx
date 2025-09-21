import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { EstabelecimentosChart } from "@/components/estabelecimentos-chart";
import { useRelatoriosControllerRecebimentosVendedor } from "@/gen";
import {
  FallbackNoData,
  RecebiveisSkeleton,
} from "../financeiro/metric-skeleton";
import { formatCurrency } from "@/lib/format";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { MetricCard } from "../financeiro/metric-card";

const formSchema = z
  .object({
    from: z.date({ required_error: "Data inicial é obrigatória." }),
    to: z.date({ required_error: "Data final é obrigatória." }),
  })
  .refine((data) => data.from <= data.to, {
    message: "A data inicial não pode ser maior que a final.",
    path: ["to"],
  });

type FormValues = z.infer<typeof formSchema>;

export function VendedorDashboardPage({ id }: { id: string }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 3. Ajustar os valores padrão para a nova estrutura do schema
    defaultValues: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  });

  // 4. Observar os campos individualmente
  const { from, to } = form.watch();

  const { isLoading, data } = useRelatoriosControllerRecebimentosVendedor(id, {
    start_date: format(from, "yyyy-MM-dd"),
    finish_date: format(to, "yyyy-MM-dd"),
  });

  if (isLoading) return <RecebiveisSkeleton />;
  if (!data) return <FallbackNoData />;

  const metrics = [
    {
      title: "Valor Bruto (TPV)",
      value: formatCurrency(data.data.totais.tpv),
      description: "Volume total de transações",
      Icon: DollarSign,
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
    },
    {
      title: "Taxa Administrativa (MDR)",
      value: formatCurrency(data.data.totais.mdr),
      description: "Receita gerada pelas taxas",
      Icon: TrendingUp,
      borderColor: "border-green-500",
      iconColor: "text-green-500",
    },
    {
      title: "Valor Líquido",
      value: formatCurrency(data.data.totais.liquido),
      description: "Receita líquida após custos",
      Icon: Wallet,
      borderColor: "border-purple-500",
      iconColor: "text-purple-500",
    },
  ];

  const onSubmit = (data: FormValues) => {
    // A função de submit não é necessária para a busca, mas mantemos para consistência
    console.log("Valores do formulário:", data);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-6 items-end">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Form {...form}>
          {/* 5. Substituir o campo único por dois campos de data */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end gap-4"
          >
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Inicial</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Final</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            Icon={metric.Icon}
            borderColor={metric.borderColor}
            iconColor={metric.iconColor}
          />
        ))}
      </div>
      <EstabelecimentosChart
        start_date={format(from, "yyyy-MM-dd")}
        finish_date={format(to, "yyyy-MM-dd")}
        vendedor_id={id}
      />
    </div>
  );
}
