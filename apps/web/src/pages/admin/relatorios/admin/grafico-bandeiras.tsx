import { useMemo } from "react";
import { Calendar, Info } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { format } from "date-fns";
import type { ResumoBandeirasDto } from "@/gen";

interface Periodo {
  start_date: string;
  finish_date: string;
}

const BANDEIRA_COLORS: Record<string, string> = {
  MAESTRO: "#0066CC",
  "VISA ELECTRON": "#1A1F71",
  PIX: "#32BCAD",
  MASTERCARD: "#EB001B",
  VISA: "#1A1F71",
  ELO: "#FFD700",
  AMEX: "#006FCF",
  DEFAULT_1: "hsl(var(--chart-1))",
  DEFAULT_2: "hsl(var(--chart-2))",
  DEFAULT_3: "hsl(var(--chart-3))",
  DEFAULT_4: "hsl(var(--chart-4))",
  DEFAULT_5: "hsl(var(--chart-5))",
};

// Função para formatar números
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("pt-BR").format(num);
};

export function GraficoBandeiras({
  data,
  period,
}: {
  data: ResumoBandeirasDto;
  period?: Periodo;
}) {
  const { chartConfig, periodoFormatado, chartData } = useMemo(() => {
    if (!data || !data.items || data.items.length === 0) {
      return {
        chartConfig: {},
        periodoFormatado: "",
        chartData: [],
      };
    }

    // Ordena os dados por quantidade de vendas (maior para menor)
    const sortedItems = [...data.items].sort(
      (a, b) => b.QtdeVendas - a.QtdeVendas
    );

    // Cria a configuração de cores e legendas dinamicamente
    const config: ChartConfig = sortedItems.reduce(
      (acc, item, index) => {
        const bandeiraKey = item.Bandeira.toLowerCase().replace(/\s+/g, "_");
        acc[bandeiraKey] = {
          label: item.Bandeira,
          color:
            BANDEIRA_COLORS[item.Bandeira] ||
            BANDEIRA_COLORS[`DEFAULT_${(index % 5) + 1}`],
        };
        return acc;
      },
      {
        vendas: {
          label: "Vendas",
        },
      } as ChartConfig
    );

    // Prepara os dados com cores para o gráfico
    const processedData = sortedItems.map((item, index) => ({
      name: item.Bandeira,
      value: item.QtdeVendas,
      fill:
        BANDEIRA_COLORS[item.Bandeira] ||
        BANDEIRA_COLORS[`DEFAULT_${(index % 5) + 1}`],
    }));

    const formattedPeriod = period
      ? `De ${format(new Date(period.start_date), "dd/MM/yyyy HH:mm")} à ${format(new Date(period.finish_date), "dd/MM/yyyy HH:mm")}`
      : "";

    return {
      chartConfig: config,
      periodoFormatado: formattedPeriod,
      chartData: processedData,
    };
  }, [data, period]);

  if (!data || !data.items || data.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Bandeira</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sem dados de vendas para exibir no período selecionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalVendas = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Vendas por Bandeira</CardTitle>
        {periodoFormatado && (
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {periodoFormatado}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 relative max-h-[350px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ cx, cy, midAngle, outerRadius, name, value }) => {
                  const RADIAN = Math.PI / 180;

                  // Posição da linha conectora
                  const lineStartX =
                    cx + outerRadius * Math.cos(-midAngle! * RADIAN);
                  const lineStartY =
                    cy + outerRadius * Math.sin(-midAngle! * RADIAN);

                  // Posição do ponto de quebra da linha
                  const lineBreakX =
                    cx + (outerRadius + 20) * Math.cos(-midAngle! * RADIAN);
                  const lineBreakY =
                    cy + (outerRadius + 20) * Math.sin(-midAngle! * RADIAN);

                  // Posição final do texto (mais afastada)
                  const textX =
                    cx + (outerRadius + 50) * Math.cos(-midAngle! * RADIAN);

                  // Determina se o texto deve ficar à direita ou esquerda
                  const isRightSide = textX > cx;
                  const finalTextX = isRightSide ? textX + 10 : textX - 10;

                  const percentage = ((value! / totalVendas) * 100).toFixed(1);

                  return (
                    <g>
                      {/* Linha conectora principal */}
                      <line
                        x1={lineStartX}
                        y1={lineStartY}
                        x2={lineBreakX}
                        y2={lineBreakY}
                        stroke="#666"
                        strokeWidth={1}
                      />

                      {/* Linha horizontal */}
                      <line
                        x1={lineBreakX}
                        y1={lineBreakY}
                        x2={finalTextX}
                        y2={lineBreakY}
                        stroke="#666"
                        strokeWidth={1}
                      />

                      {/* Seta no final da linha */}
                      <polygon
                        points={`${finalTextX},${lineBreakY} ${finalTextX + (isRightSide ? -6 : 6)},${lineBreakY - 3} ${finalTextX + (isRightSide ? -6 : 6)},${lineBreakY + 3}`}
                        fill="#666"
                      />

                      {/* Texto da legenda */}
                      <text
                        x={finalTextX + (isRightSide ? 8 : -8)}
                        y={lineBreakY - 8}
                        fill="#333"
                        textAnchor={isRightSide ? "start" : "end"}
                        dominantBaseline="middle"
                        fontSize={12}
                        fontWeight="600"
                      >
                        {name}
                      </text>

                      {/* Valor e porcentagem */}
                      <text
                        x={finalTextX + (isRightSide ? 8 : -8)}
                        y={lineBreakY + 6}
                        fill="#666"
                        textAnchor={isRightSide ? "start" : "end"}
                        dominantBaseline="middle"
                        fontSize={10}
                      >
                        {formatNumber(value as number)} ({percentage}%)
                      </text>
                    </g>
                  );
                }}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>

              {/* Texto central */}
              <text
                x="50%"
                y="48%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-lg font-bold"
              >
                {formatNumber(totalVendas)}
              </text>
              <text
                x="50%"
                y="52%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm"
              >
                Total de Vendas
              </text>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none  text-blue-300">
          <Info className="h-4 w-4 text-bold" /> Apenas vendas aprovadas são
          exibidas nesta distribuição.
        </div>
      </CardFooter>
    </Card>
  );
}
