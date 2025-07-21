import { type ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"
import { useRelatoriosControllerRecebimentosVendedor } from "@/gen"
import { TrendingUp, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import { useMemo } from "react"

const chartConfig = {
  mdr: {
    label: "Comissão (MDR)",
    color: "var(--color-purple-500)",
    icon: Wallet,
  },
} satisfies ChartConfig

export function EstabelecimentosChart({ start_date, finish_date, vendedor_id }: { start_date: string; finish_date: string, vendedor_id: string }) {
  const { data: response } = useRelatoriosControllerRecebimentosVendedor(vendedor_id, { finish_date, start_date })

  // Ordenar dados por MDR (maior para menor) e formatar para exibição
  const sortedData = useMemo(() => {
    if (!response?.data) return []

    return [...response.data.recebimentos]
      .sort((a, b) => b.mdr - a.mdr)
      .map((item, index) => ({
        ...item,
        position: index + 1,
        formattedMdr: formatCurrency(item.mdr),
      }))
  }, [response?.data])

  const totalComissao = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + item.mdr, 0)
  }, [sortedData])

  // Formatação do período para exibição
  const formatPeriod = useMemo(() => {
    const startDate = new Date(start_date).toLocaleDateString("pt-BR")
    const endDate = new Date(finish_date).toLocaleDateString("pt-BR")
    return `${startDate} - ${endDate}`
  }, [start_date, finish_date])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as (typeof sortedData)[0]
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{label}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Posição: #{data.position}</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(payload[0].value as number)}</p>
            <p className="text-xs text-muted-foreground">
              {(((payload[0].value as number) / totalComissao) * 100).toFixed(1)}% do total
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  if (!sortedData.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ranking de Estabelecimentos</CardTitle>
          <CardDescription>{formatPeriod}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[500px] w-full items-center justify-center">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Nenhum dado encontrado para o período selecionado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ranking de Estabelecimentos</CardTitle>
        <CardDescription>{formatPeriod}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <BarChart
            accessibilityLayer
            data={sortedData}
            margin={{
              top: 20,
              left: 20,
              right: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--primary)"
              opacity={0.2}
            />
            <XAxis
              dataKey="estabelecimento.social_reason"
              tickLine={false}
              tickMargin={10}
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => (typeof value === "string" ? value.split(" ")[0] : value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
              tickMargin={20}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Bar
              dataKey="mdr"
              fill="var(--color-mdr)"
              radius={[4, 4, 0, 0]}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            >
              <LabelList
                dataKey="mdr"
                position="top"
                className="fill-foreground text-xs font-medium"
                formatter={(label) => (typeof label === "number" ? formatCurrency(label) : label)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
