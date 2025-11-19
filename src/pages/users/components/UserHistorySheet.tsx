import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User } from '../types'

interface UserHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

// Mock data for history
const mockHistory = [
  {
    id: 1,
    action: 'Login',
    details: 'Acesso ao sistema via Web',
    ip: '192.168.1.10',
    date: '19/11/2025 14:30',
  },
  {
    id: 2,
    action: 'Cotação',
    details: 'Criou cotação #1234',
    ip: '192.168.1.10',
    date: '19/11/2025 14:45',
  },
  {
    id: 3,
    action: 'Logout',
    details: 'Saiu do sistema',
    ip: '192.168.1.10',
    date: '19/11/2025 18:00',
  },
  {
    id: 4,
    action: 'Login',
    details: 'Acesso ao sistema via Mobile',
    ip: '200.100.50.25',
    date: '18/11/2025 09:00',
  },
  {
    id: 5,
    action: 'Relatório',
    details: 'Exportou relatório de rentabilidade',
    ip: '200.100.50.25',
    date: '18/11/2025 10:15',
  },
]

export function UserHistorySheet({
  open,
  onOpenChange,
  user,
}: UserHistorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Histórico de Acesso</SheetTitle>
          <SheetDescription>
            Atividades recentes do usuário <strong>{user?.name}</strong>.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 h-full">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
