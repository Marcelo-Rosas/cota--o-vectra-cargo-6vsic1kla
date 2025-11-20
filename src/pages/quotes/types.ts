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

export interface QuoteFormData {
  // Step 1
  client: string
  origin: string
  destination: string
  icms: number
  cargoType: 'lotacao' | 'fracionada' | 'container'
  dimensions: string
  weight: number
  collectionDate: Date | undefined
  items: number
  merchandiseValue: number

  // Step 2
  useNtcTable: boolean
  methodology: string
  applyTaxesOnCosts: boolean
  applyMarkup: boolean
  markupPercentage: number
  baseFreight: number
  loadingCost: number
  equipmentCost: number
  tollCost: number
  negotiatedFreight: number

  // Calculated Results
  calculatedRevenue: number
  totalCosts: number
  grossMargin: number
  grossMarginValue: number
  classification: 'Excelente' | 'Viável' | 'Recusar'
}

export const INITIAL_QUOTE_DATA: QuoteFormData = {
  client: '',
  origin: '',
  destination: '',
  icms: 0,
  cargoType: 'fracionada',
  dimensions: '',
  weight: 0,
  collectionDate: undefined,
  items: 0,
  merchandiseValue: 0,
  useNtcTable: true,
  methodology: 'fracionada',
  applyTaxesOnCosts: true,
  applyMarkup: true,
  markupPercentage: 30,
  baseFreight: 0,
  loadingCost: 0,
  equipmentCost: 0,
  tollCost: 0,
  negotiatedFreight: 0,
  calculatedRevenue: 0,
  totalCosts: 0,
  grossMargin: 0,
  grossMarginValue: 0,
  classification: 'Viável',
}
