import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Info } from "lucide-react"

export function GraficoBandeirasSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="h-6 bg-muted rounded animate-pulse w-48" />
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="h-4 bg-muted rounded animate-pulse w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 relative max-h-[350px] min-h-[350px] flex items-center justify-center">
          {/* Círculo principal do gráfico */}
          <div className="relative">
            {/* Anel externo */}
            <div className="w-48 h-48 rounded-full border-8 border-muted animate-pulse" />

            {/* Círculo interno */}
            <div className="absolute inset-[60px] bg-background rounded-full border-2 border-muted" />

            {/* Texto central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="h-6 bg-muted rounded animate-pulse w-16 mb-1" />
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
            </div>

            {/* Fatias simuladas */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="absolute w-2 h-16 bg-muted rounded animate-pulse"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "50% 100%",
                  transform: `translate(-50%, -100%) rotate(${index * 60}deg)`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}

            {/* Labels externos simulados */}
            {[...Array(6)].map((_, index) => {
              const angle = index * 60 - 90
              const radian = (angle * Math.PI) / 180
              const radius = 140
              const x = radius * Math.cos(radian)
              const y = radius * Math.sin(radian)

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="space-y-1">
                    <div
                      className="h-3 bg-muted rounded animate-pulse"
                      style={{
                        width: `${50 + Math.random() * 40}px`,
                        animationDelay: `${index * 0.1 + 0.2}s`,
                      }}
                    />
                    <div
                      className="h-2 bg-muted rounded animate-pulse"
                      style={{
                        width: `${30 + Math.random() * 30}px`,
                        animationDelay: `${index * 0.1 + 0.3}s`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none">
          <Info className="h-4 w-4 text-muted-foreground" />
          <div className="h-4 bg-muted rounded animate-pulse w-80" />
        </div>
      </CardFooter>
    </Card>
  )
}