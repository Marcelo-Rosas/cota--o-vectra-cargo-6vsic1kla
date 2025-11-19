import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Search, Plus, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const clients = [
  {
    id: 1,
    name: 'Tech Solutions SA',
    cnpj: '12.345.678/0001-90',
    contact: 'Ana Silva',
    quotes: 45,
    profitability: 'Alta',
    status: 'Ativo',
  },
  {
    id: 2,
    name: 'Indústria Beta',
    cnpj: '98.765.432/0001-10',
    contact: 'Carlos Souza',
    quotes: 23,
    profitability: 'Média',
    status: 'Ativo',
  },
  {
    id: 3,
    name: 'Comércio Global',
    cnpj: '45.678.901/0001-23',
    contact: 'Roberto Lima',
    quotes: 12,
    profitability: 'Baixa',
    status: 'Inativo',
  },
]

export default function ClientManagement() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestão de Clientes
        </h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Carteira de Clientes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cliente..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Cotações</TableHead>
                <TableHead>Rentabilidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.cnpj}</TableCell>
                  <TableCell>{client.contact}</TableCell>
                  <TableCell>{client.quotes}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        client.profitability === 'Alta'
                          ? 'default'
                          : client.profitability === 'Média'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {client.profitability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Desativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
