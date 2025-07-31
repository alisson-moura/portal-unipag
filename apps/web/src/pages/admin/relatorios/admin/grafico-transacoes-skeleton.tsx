import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export function ResumoTransacoesStatusChartSkeleton() {
  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="h-6 bg-muted rounded animate-pulse w-48" />
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="h-4 bg-muted rounded animate-pulse w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resumo dos percentuais - Cards menores */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
              <div className="h-6 bg-green-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-green-100 rounded animate-pulse w-16 mx-auto" />
            </div>
            <div className="text-center p-2 bg-red-50 rounded-md border border-red-200">
              <div className="h-6 bg-red-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-red-100 rounded animate-pulse w-12 mx-auto" />
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-md border border-orange-200">
              <div className="h-6 bg-orange-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-orange-100 rounded animate-pulse w-16 mx-auto" />
            </div>
          </div>

          {/* Área do gráfico */}
          <div className="h-[350px] w-full bg-muted/20 rounded-lg border relative overflow-hidden">
            {/* Simulação do grid do gráfico */}
            <div className="absolute inset-0 p-4">
              {/* Linhas horizontais do grid */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-16 right-4 border-t border-muted-foreground/10"
                  style={{ top: `${20 + i * 15}%` }}
                />
              ))}

              {/* Eixo Y - Labels */}
              <div className="absolute left-2 top-4 bottom-16 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 bg-muted rounded animate-pulse w-12" />
                ))}
              </div>

              {/* Barras do gráfico */}
              <div className="absolute left-16 right-4 bottom-16 top-8 flex items-end justify-between gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex-1 flex items-end justify-center gap-1">
                    {/* Barra Verde (Aprovadas) */}
                    <div
                      className="bg-green-200 rounded-t animate-pulse w-3"
                      style={{
                        height: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                    {/* Barra Vermelha (Negadas) */}
                    <div
                      className="bg-red-200 rounded-t animate-pulse w-3"
                      style={{
                        height: `${Math.random() * 40 + 10}%`,
                        animationDelay: `${i * 0.1 + 0.05}s`,
                      }}
                    />
                    {/* Barra Laranja (Pendentes) */}
                    <div
                      className="bg-orange-200 rounded-t animate-pulse w-3"
                      style={{
                        height: `${Math.random() * 20 + 5}%`,
                        animationDelay: `${i * 0.1 + 0.1}s`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Eixo X - Labels */}
              <div className="absolute left-16 right-4 bottom-2 flex justify-between">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-3 bg-muted rounded animate-pulse w-8" />
                ))}
              </div>

              {/* Legenda */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-12" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-200 rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16" />
                </div>
              </div>
            </div>

            {/* Overlay com efeito shimmer */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{
                animation: "shimmer 2s infinite",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
