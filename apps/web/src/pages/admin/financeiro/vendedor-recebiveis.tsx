import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { ListaVendedorRecebimentos } from "./lista-vendedor-recebimentos";
import { formatCurrency } from "@/lib/format";
import { FallbackNoData } from "./metric-skeleton";
import { MetricCard } from "./metric-card";
import { RecebiveisSkeleton } from "./metric-skeleton";
import { useRelatoriosControllerRecebimentosVendedor } from "@/gen";


export function VendedorRecebiveis({ vendedor_id, start_date, finish_date }: { vendedor_id: string, finish_date: string, start_date: string }) {
    const { isLoading, data } = useRelatoriosControllerRecebimentosVendedor(vendedor_id, {start_date, finish_date})

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

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <ListaVendedorRecebimentos data={data.data.recebimentos} />
        </div>
    )
}