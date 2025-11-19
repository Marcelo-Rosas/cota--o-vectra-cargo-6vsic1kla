import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const logs = [
  {
    id: 1,
    user: 'João Silva',
    action: 'Cotação Criada',
    module: 'Cotações',
    date: '19/11/2025 14:30',
  },
  {
    id: 2,
    user: 'Maria Oliveira',
    action: 'Alteração de Tabela',
    module: 'Configurações',
    date: '19/11/2025 10:15',
  },
  {
    id: 3,
    user: 'Sistema',
    action: 'Backup Automático',
    module: 'Sistema',
    date: '19/11/2025 03:00',
  },
]

export default function AuditLog() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Auditoria e Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Módulo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.module}</Badge>
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
