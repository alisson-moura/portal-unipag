import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Contador } from "@/gen";
import { formatCurrency } from "@/lib/format";

export  function TransactionsCards({ contador }: {contador: Contador}) {
    const cardData = [
      {
        title: "Vendas Aprovadas",
        value: formatCurrency(contador.aprovadas.valor),
        count: `${contador.aprovadas.quantidade.toLocaleString("pt-BR")} VENDAS`,
        titleColor: "text-green-700",
      },
      {
        title: "Vendas Pendentes",
        value: formatCurrency(contador.pendentes.valor),
        count: `${contador.pendentes.quantidade.toLocaleString("pt-BR")} VENDAS`,
        titleColor: "text-orange-700",
      },
      {
        title: "Vendas Negadas",
        value: formatCurrency(contador.negadas.valor),
        count: `${contador.negadas.quantidade.toLocaleString("pt-BR")} VENDAS`,
        titleColor: "text-red-700",
      },
      {
        title: "Devolvida / Estornada",
        value: formatCurrency(contador.devolvidas.valor + contador.desfeitas.valor),
        count: `${(contador.devolvidas.quantidade + contador.desfeitas.quantidade).toLocaleString("pt-BR")} VENDAS`,
        titleColor: "text-slate-700",
      },
    ]
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cardData.map((card, index) => (
          <Card key={index} className="bg-background border border-border">
            <CardHeader>
              <CardTitle className={`text-sm font-medium ${card.titleColor}`}>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{card.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{card.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }