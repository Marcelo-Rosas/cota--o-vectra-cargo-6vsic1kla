import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocation } from 'react-router-dom'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

export function AppHeader() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const getPageTitle = (path: string) => {
    switch (path) {
      case '':
        return 'Dashboard Principal'
      case 'quotes':
        return 'Gestão de Cotações'
      case 'new':
        return 'Nova Cotação'
      case 'analysis':
        return 'Análise de Viabilidade'
      case 'clients':
        return 'Gestão de Clientes'
      case 'reports':
        return 'Relatórios Avançados'
      case 'settings':
        return 'Configurações'
      case 'tax':
        return 'Módulo Tributário'
      case 'audit':
        return 'Auditoria'
      case 'users':
        return 'Gestão de Usuários'
      case 'territorial':
        return 'Tabelas de Referência'
      case 'tools':
        return 'Ferramentas'
      case 'reverse-cubage':
        return 'Calculadora de Cubagem'
      default:
        return path.charAt(0).toUpperCase() + path.slice(1)
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-10 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Vectra Cargo</BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <div key={segment} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage>{getPageTitle(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                  >
                    {getPageTitle(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
          {pathSegments.length === 0 && (
            <div className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </div>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar cotações, clientes..."
            className="pl-8 h-9"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 font-semibold border-b">Notificações</div>
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col gap-1 p-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Cotação #{1000 + i} Aprovada
                      </span>
                      <span className="text-xs text-muted-foreground">
                        2m atrás
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A cotação para Cliente Exemplo LTDA foi aprovada pela
                      gerência.
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
