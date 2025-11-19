import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  History,
  KeyRound,
  Pencil,
  Filter,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { User, USER_PROFILES, UserProfile } from './types'
import { UserFormDialog } from './components/UserFormDialog'
import { PasswordResetDialog } from './components/PasswordResetDialog'
import { UserHistorySheet } from './components/UserHistorySheet'

// Mock initial data
const initialUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@vectra.com',
    profile: 'Gerente Comercial',
    status: 'Ativo',
    lastAccess: '19/11/2025 14:30',
    avatarSeed: '1',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria@vectra.com',
    profile: 'Calculista Sênior',
    status: 'Ativo',
    lastAccess: '19/11/2025 10:15',
    avatarSeed: '2',
  },
  {
    id: 3,
    name: 'Pedro Santos',
    email: 'pedro@vectra.com',
    profile: 'Auditor',
    status: 'Inativo',
    lastAccess: '15/11/2025 09:00',
    avatarSeed: '3',
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@vectra.com',
    profile: 'Admin Master',
    status: 'Ativo',
    lastAccess: '19/11/2025 16:45',
    avatarSeed: '4',
  },
  {
    id: 5,
    name: 'Carlos Souza',
    email: 'carlos@cliente.com',
    profile: 'Cliente Externo',
    status: 'Ativo',
    lastAccess: '18/11/2025 11:20',
    avatarSeed: '5',
  },
]

export default function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileFilter, setProfileFilter] = useState<string>('all')

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProfile =
      profileFilter === 'all' || user.profile === profileFilter
    return matchesSearch && matchesProfile
  })

  // Handlers
  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setIsResetOpen(true)
  }

  const handleViewHistory = (user: User) => {
    setSelectedUser(user)
    setIsHistoryOpen(true)
  }

  const handleSaveUser = (userData: any) => {
    if (selectedUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...userData } : u,
        ),
      )
      toast({
        title: 'Usuário atualizado',
        description: `Os dados de ${userData.name} foram atualizados com sucesso.`,
      })
    } else {
      // Create new user
      const newUser: User = {
        ...userData,
        id: Math.max(...users.map((u) => u.id)) + 1,
        lastAccess: '-',
        avatarSeed: String(Math.random()),
      }
      setUsers([...users, newUser])
      toast({
        title: 'Usuário criado',
        description: `O usuário ${userData.name} foi criado com sucesso.`,
      })
    }
  }

  const handleConfirmPasswordReset = (password: string) => {
    toast({
      title: 'Senha redefinida',
      description: `A senha do usuário ${selectedUser?.name} foi alterada com sucesso.`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">
            Gerencie contas, perfis e permissões de acesso ao sistema.
          </p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle>Usuários Cadastrados</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={profileFilter} onValueChange={setProfileFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filtrar por Perfil" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Perfis</SelectItem>
                  {USER_PROFILES.map((profile) => (
                    <SelectItem key={profile} value={profile}>
                      {profile}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Último Acesso
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={`https://img.usecurling.com/ppl/thumbnail?gender=${user.id % 2 === 0 ? 'female' : 'male'}&seed=${user.avatarSeed}`}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3 text-muted-foreground" />
                          <span>{user.profile}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === 'Ativo' ? 'default' : 'secondary'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {user.lastAccess}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar Dados
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleResetPassword(user)}
                            >
                              <KeyRound className="mr-2 h-4 w-4" />
                              Redefinir Senha
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewHistory(user)}
                            >
                              <History className="mr-2 h-4 w-4" />
                              Ver Histórico
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <PasswordResetDialog
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
        user={selectedUser}
        onConfirm={handleConfirmPasswordReset}
      />

      <UserHistorySheet
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        user={selectedUser}
      />
    </div>
  )
}
