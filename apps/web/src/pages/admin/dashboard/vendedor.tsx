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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { EstabelecimentosChart } from "@/components/estabelecimentos-chart";
import { useRelatoriosControllerRecebimentosVendedor } from "@/gen";
import { FallbackNoData, RecebiveisSkeleton } from "../financeiro/metric-skeleton";
import { formatCurrency } from "@/lib/format";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { MetricCard } from "../financeiro/metric-card";

const formSchema = z.object({
  range: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function VendedorDashboardPage({ id }: { id: string }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  });

  const range = form.watch("range");

  const { isLoading, data } = useRelatoriosControllerRecebimentosVendedor(id, {
    start_date: format(range.from, 'yyyy-MM-dd'),
    finish_date: format(range.to, 'yyyy-MM-dd')
  })

  if (isLoading) return <RecebiveisSkeleton />
  if (!data) return <FallbackNoData />

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
    }
  ];

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="p-4">
      <div className="flex gap-6 items-end">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
                  <FormControl>
                    <DatePickerWithRange
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
        start_date={format(range.from, 'yyyy-MM-dd')}
        finish_date={format(range.to, 'yyyy-MM-dd')}
        vendedor_id={id}
      />
    </div>
  );
}