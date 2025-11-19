import { Quote } from './types'

export const MOCK_QUOTES: Quote[] = Array.from({ length: 50 }).map((_, i) => {
  const statuses: Quote['status'][] = [
    'Aprovada',
    'Pendente',
    'Em Análise',
    'Rejeitada',
    'Rascunho',
  ]
  const clients = [
    'Tech Solutions SA',
    'Indústria Beta',
    'Comércio Global',
    'Agro Export',
    'Varejo Express',
    'Logística Integrada',
    'Construtora Alpha',
  ]
  const origins = [
    'São Paulo, SP',
    'Belo Horizonte, MG',
    'Curitiba, PR',
    'Porto Alegre, RS',
    'Rio de Janeiro, RJ',
  ]
  const destinations = [
    'Salvador, BA',
    'Recife, PE',
    'Manaus, AM',
    'Fortaleza, CE',
    'Brasília, DF',
  ]

  return {
    id: (1000 + i).toString(),
    client: clients[i % clients.length],
    origin: origins[i % origins.length],
    destination: destinations[i % destinations.length],
    value: Math.floor(Math.random() * 15000) + 1000,
    status: statuses[i % statuses.length],
    date: new Date(2025, 10, 19 - (i % 10)).toISOString().split('T')[0],
    margin: Math.floor(Math.random() * 35) + 5,
    items: Math.floor(Math.random() * 100) + 1,
    weight: Math.floor(Math.random() * 5000) + 100,
    description: `Transporte de carga geral - Lote ${i + 1}`,
  }
})
