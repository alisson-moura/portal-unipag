import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface PaginationComponentProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function TransactionsPagination({
  page,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  // Função para gerar os números das páginas a serem exibidas
  const getPageNumbers = () => {
    const delta = 2; // Quantas páginas mostrar antes e depois da atual
    const range = [];
    const rangeWithDots = [];

    // Sempre incluir a primeira página
    range.push(1);

    // Calcular o range ao redor da página atual
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    // Sempre incluir a última página (se não for a primeira)
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Adicionar ellipsis onde necessário
    let prev = 0;
    for (const i of range) {
      if (prev + 1 < i) {
        rangeWithDots.push("ellipsis");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Componente de paginação principal */}
      <Pagination>
        <PaginationContent>
          {/* Primeira página */}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={page === 1}
              className="h-9 w-9"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primeira página</span>
            </Button>
          </PaginationItem>

          {/* Página anterior */}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
          </PaginationItem>

          {/* Números das páginas */}
          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => onPageChange(pageNum as number)}
                  className="h-9 w-9"
                >
                  {pageNum}
                </Button>
              )}
            </PaginationItem>
          ))}

          {/* Próxima página */}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </PaginationItem>

          {/* Última página */}
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(totalPages)}
              disabled={page === totalPages}
              className="h-9 w-9"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
}
