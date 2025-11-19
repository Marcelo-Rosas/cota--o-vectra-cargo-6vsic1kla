export type QuoteStatus =
  | 'Aprovada'
  | 'Pendente'
  | 'Em Análise'
  | 'Rejeitada'
  | 'Rascunho'

export interface Quote {
  id: string
  client: string
  origin: string
  destination: string
  value: number
  status: QuoteStatus
  date: string
  margin: number
  items: number
  weight: number
  description?: string
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: keyof Quote
  direction: SortDirection
}

export interface QuoteFilters {
  search: string
  status: string
  dateRange: string
  client: string
}
