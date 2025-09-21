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
// 1. Importar o seletor de data único
import { DatePicker } from "@/components/ui/date-picker";
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

// 2. Atualizar o schema para campos de data separados e adicionar validação
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

export function AdminDashboardPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 3. Ajustar os valores padrão para a nova estrutura
    defaultValues: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  });

  // 4. Observar os campos individualmente
  const { from, to } = form.watch();

  const { data: totalEstabelecimentos } =
    useRelatoriosControllerTotalEstabelecimentos();
  const { data: totalVendedores } = useRelatoriosControllerTotalVendedores();
  const { data: comissaoTotal } = useRelatoriosControllerComissao({
    finish_date: format(to, "yyyy-MM-dd"),
    start_date: format(from, "yyyy-MM-dd"),
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
          {/* 5. Substituir o campo único pelos dois campos de data */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end gap-4"
          >
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Data Inicial</FormLabel>
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
                  <FormLabel className="text-sm">Data Final</FormLabel>
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
          start_date={format(from, "yyyy-MM-dd")}
          finish_date={format(to, "yyyy-MM-dd")}
        />
      </div>
    </div>
  );
}
