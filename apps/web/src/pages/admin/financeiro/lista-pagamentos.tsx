import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BanknoteArrowUp, FileDown, X } from "lucide-react"
import type { PayableDto } from "@/gen"
import { format, parseISO } from "date-fns"
import { formatCurrency } from "@/lib/format"
import * as XLSX from "xlsx"

function getBrandColor(brand: string) {
    switch (brand.toLowerCase()) {
        case "mastercard":
            return "bg-orange-100 text-orange-800"
        case "visa":
            return "bg-blue-100 text-blue-800"
        case "maestro":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}

export default function ListaPagamentos({ pagamentos, date }: { pagamentos: PayableDto[], date: string }) {
    const [isOpen, setIsOpen] = useState(false)

    function generateExcel(): void {
        const wb = XLSX.utils.book_new()
        const data = pagamentos.map(pagamento => ({
            "Data Venda": format(parseISO(pagamento.transaction_date), 'dd/MM/yyyy HH:mm'),
            "Data Recebimento": format(parseISO(pagamento.payment_date), 'dd/MM/yyyy'),
            "Bandeira": pagamento.card_brand,
            "NSU Transação": pagamento.transaction_nsu,
            Parcela: `${pagamento.payables_installment}/${pagamento.installments}`,
            "Valor Venda": formatCurrency(parseInt(pagamento.transaction_amount)),
            "Valor Parcela": formatCurrency(pagamento.payables_gross_amount),
            MDR: formatCurrency(pagamento.payables_mdr),
            RAV: formatCurrency(pagamento.payables_rav),
            "Valor à Receber": formatCurrency(pagamento.payables_net_amount),
            "Método Pagamento": pagamento.payment_method === "CRDT" ? "Crédito" : "Débito",
            Antecipado: pagamento.anticipated === "SIM" ? "Sim" : "Não",
            Status: pagamento.payables_status,
            "Código Autorização": pagamento.authorization_code,
            Estabelecimento: pagamento.merchants_name,
            CNPJ: pagamento.merchants_document_number,

        }))
        const ws = XLSX.utils.json_to_sheet(data)
        XLSX.utils.book_append_sheet(wb, ws, "Pagamentos")
        XLSX.writeFile(wb, `pagamentos_${new Date(date).toISOString().split("T")[0]}.xlsx`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><BanknoteArrowUp /> Pagamentos</Button>
            </DialogTrigger>
            <DialogContent className="min-w-7xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg font-medium text-gray-600">VISUALIZAR PAGAMENTOS: {format(parseISO(date), 'dd/MM/yyyy')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto">
                    {/* Transactions Table */}
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-white z-10">
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-xs font-medium">Data Venda</TableHead>
                                    <TableHead className="text-xs font-medium">Data Recebimento</TableHead>
                                    <TableHead className="text-xs font-medium">Bandeira</TableHead>
                                    <TableHead className="text-xs font-medium">NSU Transação</TableHead>
                                    <TableHead className="text-xs font-medium">Parcela</TableHead>
                                    <TableHead className="text-xs font-medium">Valor Venda</TableHead>
                                    <TableHead className="text-xs font-medium">Valor Parcela</TableHead>
                                    <TableHead className="text-xs font-medium">(MDR)</TableHead>
                                    <TableHead className="text-xs font-medium">(RAV)</TableHead>
                                    <TableHead className="text-xs font-medium">Valor à Receber</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagamentos.map((transaction, index) => (
                                    <TableRow key={index} className="hover:bg-gray-50">
                                        <TableCell className="text-sm">{format(parseISO(transaction.transaction_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell className="text-sm">{format(parseISO(transaction.payment_date), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getBrandColor(transaction.card_brand)}>
                                                {transaction.card_brand}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-mono">{transaction.transaction_nsu}</TableCell>
                                        <TableCell className="text-sm">{transaction.payables_installment}/{transaction.installments}</TableCell>
                                        <TableCell className="text-sm">{formatCurrency(parseInt(transaction.original_transaction_amount))}</TableCell>
                                        <TableCell className="text-sm">{formatCurrency(parseInt(transaction.transaction_amount))}</TableCell>
                                        <TableCell className="text-sm">{formatCurrency(transaction.payables_mdr)}</TableCell>
                                        <TableCell className="text-sm">{formatCurrency(transaction.payables_rav)}</TableCell>
                                        <TableCell className="text-sm font-medium">{formatCurrency(transaction.payables_net_amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <Button onClick={generateExcel} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                            <FileDown className="h-4 w-4 mr-2" />
                            Download Excel
                        </Button>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Fechar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
