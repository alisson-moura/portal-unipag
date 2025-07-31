import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format"
import type { ResumoTransacoesPeriodoDto } from "@/gen"
import { format } from "date-fns"
import { Calendar } from "lucide-react"

interface Periodo {
  start_date: string
  finish_date: string
}

// Configuração das cores do gráfico
const chartConfig = {
  Aprovadas: {
    label: "Vendas Aprovadas",
    color: "#22c55e", // Verde
  },
  Negadas: {
    label: "Vendas Negadas",
    color: "#ef4444", // Vermelho
  },
  Pendentes: {
    label: "Vendas Pendentes",
    color: "#f59e0b", // Amarelo/Laranja
  },
}

const formatarNumeroEixo = (valor: number): string => {
  const valorEmReais = valor / 100

  if (valorEmReais >= 1000000) {
    return `R$ ${(valorEmReais / 1000000).toFixed(1)}M`
  }
  if (valorEmReais >= 1000) {
    return `R$ ${(valorEmReais / 1000).toFixed(0)}K`
  }
  if (valorEmReais >= 100) {
    return `R$ ${valorEmReais.toFixed(0)}`
  }
  return `R$ ${valorEmReais.toFixed(2)}`
}

const formatarData = (dataString: string): string => {
  const data = new Date(dataString)
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })
}

// Função para formatar data completa no tooltip
const formatarDataCompleta = (dataString: string): string => {
  const data = new Date(dataString)
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function ResumoTransacoesStatusChart({
  data,
  period,
}: {
  data: ResumoTransacoesPeriodoDto
  period?: Periodo
}) {
  const formattedPeriod = period
    ? `De ${format(new Date(period.start_date), "dd/MM/yyyy HH:mm")} à ${format(new Date(period.finish_date), "dd/MM/yyyy HH:mm")}`
    : ""

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Vendas por Período</CardTitle>
          {formattedPeriod && (
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedPeriod}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resumo dos percentuais - Cards menores */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
              <div className="text-lg font-bold text-green-600">{data.percentualAprovadas}%</div>
              <div className="text-xs font-medium text-green-700">Aprovadas</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-md border border-red-200">
              <div className="text-lg font-bold text-red-600">{data.percentualNegadas}%</div>
              <div className="text-xs font-medium text-red-700">Negadas</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-md border border-orange-200">
              <div className="text-lg font-bold text-orange-600">0%</div>
              <div className="text-xs font-medium text-orange-700">Pendentes</div>
            </div>
          </div>

          {/* Gráfico de barras - Altura reduzida */}
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.items.map((item) => ({
                  Data: item.Data,
                  // Mantém os valores como inteiros (centavos)
                  Aprovadas: item.Aprovadas,
                  Negadas: item.Negadas,
                  Pendentes: item.Pendentes,
                }))}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
                barCategoryGap="8%"
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="Data"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatarData}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0} // Mostra menos labels
                  fontSize={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatarNumeroEixo}
                  fontSize={10}
                  width={60}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium mb-2">{formatarDataCompleta(label as string)}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                              <span className="text-sm">
                                {entry.name}: {formatCurrency(entry.value as number)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ChartLegend content={<ChartLegendContent payload={undefined} />} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Aprovadas" fill={chartConfig.Aprovadas.color} radius={[2, 2, 0, 0]} name="Aprovadas" />
                <Bar dataKey="Negadas" fill={chartConfig.Negadas.color} radius={[2, 2, 0, 0]} name="Negadas" />
                <Bar dataKey="Pendentes" fill={chartConfig.Pendentes.color} radius={[2, 2, 0, 0]} name="Pendentes" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
