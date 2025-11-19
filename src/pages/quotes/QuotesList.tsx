import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const quotes = [
  {
    id: '1234',
    client: 'Tech Solutions SA',
    origin: 'São Paulo, SP',
    destination: 'Curitiba, PR',
    value: 'R$ 4.500,00',
    status: 'Aprovada',
    date: '19/11/2025',
  },
  {
    id: '1235',
    client: 'Indústria Beta',
    origin: 'Belo Horizonte, MG',
    destination: 'Rio de Janeiro, RJ',
    value: 'R$ 2.800,00',
    status: 'Pendente',
    date: '19/11/2025',
  },
  {
    id: '1236',
    client: 'Comércio Global',
    origin: 'Porto Alegre, RS',
    destination: 'Florianópolis, SC',
    value: 'R$ 1.200,00',
    status: 'Em Análise',
    date: '18/11/2025',
  },
  {
    id: '1237',
    client: 'Agro Export',
    origin: 'Cuiabá, MT',
    destination: 'Santos, SP',
    value: 'R$ 15.000,00',
    status: 'Rejeitada',
    date: '18/11/2025',
  },
  {
    id: '1238',
    client: 'Varejo Express',
    origin: 'Recife, PE',
    destination: 'Salvador, BA',
    value: 'R$ 3.400,00',
    status: 'Aprovada',
    date: '17/11/2025',
  },
]

export default function QuotesList() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Cotações
          </h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as cotações de frete.
          </p>
        </div>
        <Button asChild>
          <Link to="/quotes/new">
            <Plus className="mr-2 h-4 w-4" /> Nova Cotação
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cotações Recentes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente ou ID..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">#{quote.id}</TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell>{quote.origin}</TableCell>
                  <TableCell>{quote.destination}</TableCell>
                  <TableCell>{quote.value}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        quote.status === 'Aprovada'
                          ? 'default'
                          : quote.status === 'Rejeitada'
                            ? 'destructive'
                            : quote.status === 'Pendente'
                              ? 'secondary'
                              : 'outline'
                      }
                    >
                      {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{quote.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
