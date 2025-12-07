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

export type UrgencyLevel = 'normal' | 'alta' | 'expressa'
export type MethodologyType = 'fracionada' | 'lotacao' | 'container' | 'antt'

export interface QuoteFormData {
  // Step 1 - Dados do Embarque
  client: string
  origin: string
  originCep: string
  destination: string
  destinationCep: string
  distance: number
  icms: number

  // Cargo Details
  cargoType: 'lotacao' | 'fracionada' | 'container' // Initial intent

  // Dimensions & Weight
  dimLength: number
  dimWidth: number
  dimHeight: number
  cubage: number // m3
  cubedWeight: number // kg

  weight: number
  collectionDate: Date | undefined
  items: number
  merchandiseValue: number
  urgency: UrgencyLevel

  // Step 2 - Parâmetros de Cálculo
  useNtcTable: boolean
  methodology: MethodologyType // Selected for calculation
  recommendedMethodology: MethodologyType

  // Comparison Data (Automated Calculation Results)
  costFracionado: number
  costLotacao: number
  timeFracionado: number // days
  timeLotacao: number // days

  applyTaxesOnCosts: boolean
  applyMarkup: boolean
  markupPercentage: number

  // Operational Costs
  baseFreight: number // Frete Caminhão / Base (Selected Cost)
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
  distance: 0,
  icms: 0,
  cargoType: 'fracionada',
  dimLength: 0,
  dimWidth: 0,
  dimHeight: 0,
  cubage: 0,
  cubedWeight: 0,
  weight: 0,
  collectionDate: undefined,
  items: 0,
  merchandiseValue: 0,
  urgency: 'normal',
  useNtcTable: true,
  methodology: 'fracionada',
  recommendedMethodology: 'fracionada',
  costFracionado: 0,
  costLotacao: 0,
  timeFracionado: 0,
  timeLotacao: 0,
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
