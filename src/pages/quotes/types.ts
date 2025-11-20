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
  // Extended fields for detailed view
  baseFreight?: number
  taxCost?: number
  operationalCostTotal?: number
  merchandiseValue?: number
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
  // Step 1 - Dados do Embarque
  client: string
  origin: string
  originCep: string
  destination: string
  destinationCep: string
  icms: number
  cargoType: 'lotacao' | 'fracionada' | 'container'
  dimensions: string
  weight: number
  collectionDate: Date | undefined
  items: number
  merchandiseValue: number

  // Step 2 - Parâmetros de Cálculo
  useNtcTable: boolean
  methodology: string
  applyTaxesOnCosts: boolean
  applyMarkup: boolean
  markupPercentage: number

  // Operational Costs
  baseFreight: number // Frete Caminhão / Base
  loadingCost: number // Carga/Descarga
  equipmentCost: number // Aluguel Equipamentos
  tollCost: number // Pedágio
  negotiatedFreight: number // Frete Negociado (AO2)

  // Calculated Results
  calculatedRevenue: number // AV2
  totalCosts: number
  grossMargin: number // %
  grossMarginValue: number // BB2
  classification: 'Excelente' | 'Viável' | 'Recusar'

  // Breakdown
  taxCost: number
  operationalCostTotal: number
}

export const INITIAL_QUOTE_DATA: QuoteFormData = {
  client: '',
  origin: '',
  originCep: '',
  destination: '',
  destinationCep: '',
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
  taxCost: 0,
  operationalCostTotal: 0,
}
