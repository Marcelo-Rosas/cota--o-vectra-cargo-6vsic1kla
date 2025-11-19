import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  MoreHorizontal,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { QuoteFilters } from '../types'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface QuotesToolbarProps {
  filters: QuoteFilters
  onFilterChange: (key: keyof QuoteFilters, value: string) => void
  onBatchAction: (action: string) => void
  selectedCount: number
}

export function QuotesToolbar({
  filters,
  onFilterChange,
  onBatchAction,
  selectedCount,
}: QuotesToolbarProps) {
  const [date, setDate] = useState<Date>()

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      onFilterChange('dateRange', newDate.toISOString())
    } else {
      onFilterChange('dateRange', '')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, cliente ou origem..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Filtros Avançados
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Refine sua busca por critérios específicos.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-sm">Status</span>
                    <Select
                      value={filters.status}
                      onValueChange={(val) => onFilterChange('status', val)}
                    >
                      <SelectTrigger className="col-span-2 h-8">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Aprovada">Aprovada</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-sm">Data</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'col-span-2 h-8 justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Ações em Lote ({selectedCount})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  Selecionados: {selectedCount}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onBatchAction('export')}>
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBatchAction('approve')}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Aprovar Todos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onBatchAction('delete')}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir Todos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button asChild>
            <Link to="/quotes/new">
              <Plus className="mr-2 h-4 w-4" /> Nova Cotação
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Todos', 'Aprovada', 'Pendente', 'Em Análise', 'Rejeitada'].map(
          (status) => (
            <Button
              key={status}
              variant={
                filters.status === status ||
                (filters.status === 'all' && status === 'Todos')
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() =>
                onFilterChange('status', status === 'Todos' ? 'all' : status)
              }
              className="rounded-full"
            >
              {status}
            </Button>
          ),
        )}
      </div>
    </div>
  )
}
