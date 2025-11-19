import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import {
  ArrowUpDown,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
  Eye,
} from 'lucide-react'
import { Quote, SortConfig } from '../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface QuotesTableProps {
  data: Quote[]
  selectedIds: string[]
  sortConfig: SortConfig
  onSort: (key: keyof Quote) => void
  onSelectAll: (checked: boolean) => void
  onSelectRow: (id: string, checked: boolean) => void
  onRowClick: (quote: Quote) => void
  onAction: (action: string, quote: Quote) => void
}

export function QuotesTable({
  data,
  selectedIds,
  sortConfig,
  onSort,
  onSelectAll,
  onSelectRow,
  onRowClick,
  onAction,
}: QuotesTableProps) {
  const allSelected = data.length > 0 && selectedIds.length === data.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return 'default'
      case 'Rejeitada':
        return 'destructive'
      case 'Pendente':
        return 'secondary'
      case 'Em Análise':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getMarginColor = (margin: number) => {
    if (margin < 10) return 'bg-red-500'
    if (margin < 20) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                onClick={() => onSort('id')}
                className="h-8 px-2 -ml-2"
              >
                Cotação
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('client')}
                className="h-8 px-2 -ml-2"
              >
                Cliente
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Origem / Destino</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('date')}
                className="h-8 px-2 -ml-2"
              >
                Data
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('value')}
                className="h-8 px-2 -ml-2"
              >
                Valor
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px]">Margem</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nenhuma cotação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            data.map((quote) => (
              <TableRow
                key={quote.id}
                className="group cursor-pointer hover:bg-muted/50"
                onClick={(e) => {
                  // Prevent row click when clicking checkbox or actions
                  if (
                    (e.target as HTMLElement).closest('[role="checkbox"]') ||
                    (e.target as HTMLElement).closest('button')
                  ) {
                    return
                  }
                  onRowClick(quote)
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(quote.id)}
                    onCheckedChange={(checked) =>
                      onSelectRow(quote.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => onRowClick(quote)}
                  >
                    #{quote.id}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{quote.client}</span>
                    <span className="text-xs text-muted-foreground">
                      {quote.items} volumes • {quote.weight}kg
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{quote.origin}</span>
                    <span className="text-muted-foreground text-xs">
                      ➔ {quote.destination}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(quote.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium">
                  {quote.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(quote.status)}>
                    {quote.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={quote.margin}
                      className="h-2 w-16"
                      indicatorClassName={getMarginColor(quote.margin)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {quote.margin}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onRowClick(quote)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver Detalhes</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onAction('edit', quote)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction('duplicate', quote)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction('delete', quote)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
