import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/gen";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getPaymentMethodColor,
  getPaymentMethodLabel,
  getStatusColor,
  getStatusLabel,
} from "@/components/map-transaction-status";

export function TransactionsGestorList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="overflow-x-auto border rounded">
        <Table className="">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[120px] text-xs font-medium text-gray-600">
                Data
              </TableHead>
              <TableHead className="w-[100px] text-xs font-medium text-gray-600">
                Bandeira
              </TableHead>
              <TableHead className="w-[100px] text-xs font-medium text-gray-600">
                NSU
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-600">
                Estabelecimento
              </TableHead>
              <TableHead className="w-[120px] text-xs font-medium text-gray-600">
                Modalidade
              </TableHead>
              <TableHead className="w-[100px] text-xs font-medium text-gray-600">
                Valor
              </TableHead>
              <TableHead className="w-[100px] text-xs font-medium text-gray-600">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-600 w-16">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="text-xs text-gray-700">
                  {(() => {
                    const isoDateString =
                      transaction.start_date.replace(" ", "T") + "Z";
                    const date = new Date(isoDateString);
                    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
                  })()}
                </TableCell>
                <TableCell className="text-xs text-gray-700">
                  <div className="flex items-center">
                    <div className="h-5 bg-gray-200 rounded px-2 text-xs flex items-center justify-center font-medium">
                      {transaction.card_brand.toUpperCase()}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-blue-600">
                  {transaction.nsu}
                </TableCell>
                <TableCell className="text-gray-700 max-w-48">
                  <div className="truncate" title={transaction.merchant_name}>
                    {transaction.merchant_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.merchant_document_number}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs px-2 py-1 ${getPaymentMethodColor(transaction.payment_method)}`}
                  >
                    {getPaymentMethodLabel(transaction.payment_method)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-700 font-medium">
                  {formatCurrency(Number.parseInt(transaction.amount))}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs px-2 py-1 ${getStatusColor(transaction.status)}`}
                  >
                    ✓ {getStatusLabel(transaction.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <Eye className="h-4 w-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[750px] min-h-[50vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>
              Informações completas da transação selecionada
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">
                    Informações Gerais
                  </h4>
                  <div className="space-y-1">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">NSU:</span>
                      <span className="font-medium">
                        {selectedTransaction.nsu}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Autorização:</span>
                      <span className="font-medium">
                        {selectedTransaction.authorization_code}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        className={`text-xs ${getStatusColor(selectedTransaction.status)}`}
                      >
                        {getStatusLabel(selectedTransaction.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900">
                    Valores e Datas
                  </h4>
                  <div className="space-y-1">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          Number.parseInt(selectedTransaction.amount)
                        )}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Data Transação:</span>
                      <span className="font-medium">
                        {(() => {
                          const isoDateString =
                            selectedTransaction.start_date.replace(" ", "T") +
                            "Z";
                          const date = new Date(isoDateString);
                          return format(date, "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          });
                        })()}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Data Pagamento:</span>
                      <span className="font-medium">
                        {(() => {
                          const isoDateString =
                            selectedTransaction.payment_date.replace(" ", "T") +
                            "Z";
                          const date = new Date(isoDateString);
                          return format(date, "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          });
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Pagamento */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">
                  Detalhes do Pagamento
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Bandeira:</span>
                      <span className="font-medium">
                        {selectedTransaction.card_brand}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Modalidade:</span>
                      <Badge
                        className={`text-xs ${getPaymentMethodColor(selectedTransaction.payment_method)}`}
                      >
                        {getPaymentMethodLabel(
                          selectedTransaction.payment_method
                        )}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Parcelas:</span>
                      <span className="font-medium">
                        {selectedTransaction.installments}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-600">Método Captura:</span>
                      <span className="font-medium">
                        {selectedTransaction.capture_method}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Estabelecimento */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-900">
                  Estabelecimento
                </h4>
                <div className="space-y-1">
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">
                      {selectedTransaction.merchant_name}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">Documento:</span>
                    <span className="font-medium">
                      {selectedTransaction.merchant_document_number}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">Terminal:</span>
                    <span className="font-medium">
                      {selectedTransaction.device_serial_number}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
