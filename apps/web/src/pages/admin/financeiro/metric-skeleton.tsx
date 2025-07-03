import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";

export const FallbackNoData = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Nenhuma informação disponivel</h3>
            <p className="text-gray-500 max-w-md">
              Não encontramos nenhum registro para os filtros fornecidos.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" /> {/* Skeleton para o título */}
                <Skeleton className="h-4 w-4" />   {/* Skeleton para o ícone */}
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-40 mb-2" /> {/* Skeleton para o valor */}
                <Skeleton className="h-3 w-48" />      {/* Skeleton para a descrição */}
            </CardContent>
        </Card>
    )
}

export function RecebiveisSkeleton() {
        return (
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                {/* Skeleton para a lista (opcional, mas recomendado) */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-5 w-1/6" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
}