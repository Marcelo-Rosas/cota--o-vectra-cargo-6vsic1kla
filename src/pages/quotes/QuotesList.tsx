import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useToast } from '@/hooks/use-toast'
import { QuotesTable } from './components/QuotesTable'
import { QuotesToolbar } from './components/QuotesToolbar'
import { QuoteDetailsModal } from './components/QuoteDetailsModal'
import { MOCK_QUOTES } from './data'
import { Quote, QuoteFilters, SortConfig } from './types'

const ITEMS_PER_PAGE = 10

export default function QuotesList() {
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc',
  })
  const [filters, setFilters] = useState<QuoteFilters>({
    search: '',
    status: 'all',
    dateRange: '',
    client: '',
  })

  // Modal States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null)

  // Filtering Logic
  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch =
        quote.client.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.id.includes(filters.search) ||
        quote.origin.toLowerCase().includes(filters.search.toLowerCase()) ||
        quote.destination.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus =
        filters.status === 'all' || quote.status === filters.status

      const matchesDate =
        !filters.dateRange || quote.date === filters.dateRange.split('T')[0]

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [quotes, filters])

  // Sorting Logic
  const sortedQuotes = useMemo(() => {
    return [...filteredQuotes].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === undefined || bValue === undefined) return 0

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredQuotes, sortConfig])

  // Pagination Logic
  const totalPages = Math.ceil(sortedQuotes.length / ITEMS_PER_PAGE)
  const paginatedQuotes = sortedQuotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // Handlers
  const handleSort = (key: keyof Quote) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedQuotes.map((q) => q.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleRowClick = (quote: Quote) => {
    setCurrentQuote(quote)
    setIsDetailsOpen(true)
  }

  const handleAction = (action: string, quote: Quote) => {
    if (action === 'delete') {
      setQuoteToDelete(quote)
      setIsDeleteAlertOpen(true)
    } else if (action === 'edit') {
      handleRowClick(quote)
    } else if (action === 'duplicate') {
      const newQuote = {
        ...quote,
        id: (Math.max(...quotes.map((q) => parseInt(q.id))) + 1).toString(),
        status: 'Rascunho' as const,
        date: new Date().toISOString().split('T')[0],
      }
      setQuotes([newQuote, ...quotes])
      toast({
        title: 'Cotação Duplicada',
        description: `A cotação #${quote.id} foi duplicada com sucesso.`,
      })
    }
  }

  const handleBatchAction = (action: string) => {
    if (action === 'delete') {
      setQuotes(quotes.filter((q) => !selectedIds.includes(q.id)))
      setSelectedIds([])
      toast({
        title: 'Exclusão em Lote',
        description: `${selectedIds.length} cotações foram excluídas.`,
      })
    } else if (action === 'approve') {
      setQuotes(
        quotes.map((q) =>
          selectedIds.includes(q.id) ? { ...q, status: 'Aprovada' } : q,
        ),
      )
      setSelectedIds([])
      toast({
        title: 'Aprovação em Lote',
        description: `${selectedIds.length} cotações foram aprovadas.`,
      })
    } else if (action === 'export') {
      toast({
        title: 'Exportação Iniciada',
        description: `O download de ${selectedIds.length} cotações começará em breve.`,
      })
    }
  }

  const handleConfirmDelete = () => {
    if (quoteToDelete) {
      setQuotes(quotes.filter((q) => q.id !== quoteToDelete.id))
      setQuoteToDelete(null)
      setIsDeleteAlertOpen(false)
      toast({
        title: 'Cotação Excluída',
        description: `A cotação #${quoteToDelete.id} foi removida permanentemente.`,
        variant: 'destructive',
      })
    }
  }

  const handleModalAction = (
    action: 'approve' | 'reject' | 'renegotiate',
    quote: Quote,
  ) => {
    let newStatus: Quote['status'] = quote.status
    let message = ''

    switch (action) {
      case 'approve':
        newStatus = 'Aprovada'
        message = `Cotação #${quote.id} aprovada com sucesso.`
        break
      case 'reject':
        newStatus = 'Rejeitada'
        message = `Cotação #${quote.id} rejeitada.`
        break
      case 'renegotiate':
        newStatus = 'Em Análise'
        message = `Cotação #${quote.id} enviada para renegociação.`
        break
    }

    setQuotes(
      quotes.map((q) => (q.id === quote.id ? { ...q, status: newStatus } : q)),
    )
    setCurrentQuote({ ...quote, status: newStatus })
    toast({ title: 'Status Atualizado', description: message })

    if (action !== 'renegotiate') {
      setIsDetailsOpen(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Gestão de Cotações
        </h1>
        <p className="text-muted-foreground">
          Visualize, filtre e gerencie todas as cotações de frete em um só
          lugar.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <QuotesToolbar
            filters={filters}
            onFilterChange={(key, value) =>
              setFilters((prev) => ({ ...prev, [key]: value }))
            }
            onBatchAction={handleBatchAction}
            selectedCount={selectedIds.length}
          />
        </CardHeader>
        <CardContent>
          <QuotesTable
            data={paginatedQuotes}
            selectedIds={selectedIds}
            sortConfig={sortConfig}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onRowClick={handleRowClick}
            onAction={handleAction}
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedQuotes.length)} de{' '}
              {sortedQuotes.length} resultados
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = i + 1
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i
                  }
                  if (pageNum > totalPages) return null

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <QuoteDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        quote={currentQuote}
        onAction={handleModalAction}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              cotação #{quoteToDelete?.id} e removerá seus dados de nossos
              servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
