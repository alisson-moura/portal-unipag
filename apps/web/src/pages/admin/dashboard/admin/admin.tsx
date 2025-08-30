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
import {
  useRelatoriosControllerComissao,
  useRelatoriosControllerTotalEstabelecimentos,
  useRelatoriosControllerTotalVendedores,
} from "@/gen/hooks/RelatoriosHooks";
import { formatCurrency } from "@/lib/format";
import { Store, Users, Wallet } from "lucide-react";
import { MetricCard } from "../../financeiro/metric-card";
import { RankingVendedoresChart } from "@/components/ranking-vendedores-chart";
import { format } from "date-fns";

const formSchema = z.object({
  range: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminDashboardPage() {
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

  const { data: totalEstabelecimentos } =
    useRelatoriosControllerTotalEstabelecimentos();
  const { data: totalVendedores } = useRelatoriosControllerTotalVendedores();
  const { data: comissaoTotal } = useRelatoriosControllerComissao({
    finish_date: format(range.to, "yyyy-MM-dd"),
    start_date: format(range.from, "yyyy-MM-dd"),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const metrics = [
    {
      title: "Estabelecimentos",
      value: totalEstabelecimentos?.data.total ?? 0,
      description:
        "Total de estabelecimentos que possuem vendedores atribuídos",
      Icon: Store,
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
    },
    {
      title: "Vendedores",
      value: totalVendedores?.data.total ?? 0,
      description: "Total de vendedores cadastrados",
      Icon: Users,
      borderColor: "border-green-500",
      iconColor: "text-green-500",
    },
    {
      title: "Comissão total (MDR)",
      value: formatCurrency(comissaoTotal?.data.total ?? 0),
      description: "Receita total gerada pelas taxas administrativas",
      Icon: Wallet,
      borderColor: "border-purple-500",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:items-end">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Período</FormLabel>
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
      <Separator className="my-4 sm:my-6" />
      <div className="my-4 sm:my-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      <div className="mt-4 sm:mt-6">
        <RankingVendedoresChart
          start_date={format(range.from, "yyyy-MM-dd")}
          finish_date={format(range.to, "yyyy-MM-dd")}
        />
      </div>
    </div>
  );
}
