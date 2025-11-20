import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Quote } from '../types'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
  Download,
  Clock,
  MapPin,
  Package,
  DollarSign,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'

interface QuoteDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: Quote | null
  onAction: (action: 'approve' | 'reject' | 'renegotiate', quote: Quote) => void
}

export function QuoteDetailsModal({
  open,
  onOpenChange,
  quote,
  onAction,
}: QuoteDetailsModalProps) {
  if (!quote) return null

  // Fallback values if extended data is missing
  const baseFreight = quote.baseFreight || quote.value * 0.5
  const taxCost = quote.taxCost || quote.value * 0.18
  const operationalCostTotal = quote.operationalCostTotal || quote.value * 0.2
  const merchandiseValue = quote.merchandiseValue || quote.value * 10

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl text-primary">
                Cotação #{quote.id}
              </DialogTitle>
              <DialogDescription>
                Criada em {new Date(quote.date).toLocaleDateString('pt-BR')}
              </DialogDescription>
            </div>
            <Badge
              variant={
                quote.status === 'Aprovada'
                  ? 'default'
                  : quote.status === 'Rejeitada'
                    ? 'destructive'
                    : 'secondary'
              }
              className="text-sm px-3 py-1"
            >
              {quote.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="main" className="h-full flex flex-col">
            <div className="px-6 pt-2 border-b">
              <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="main"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Dados Principais
                </TabsTrigger>
                <TabsTrigger
                  value="calculations"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Cálculos Detalhados
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Histórico
                </TabsTrigger>
                <TabsTrigger
                  value="attachments"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Anexos
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 bg-muted/5">
              <div className="p-6">
                <TabsContent value="main" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-primary">
                          <MapPin className="h-4 w-4" /> Rota
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                          <span className="text-muted-foreground">Origem:</span>
                          <span className="font-medium">{quote.origin}</span>
                          <span className="text-muted-foreground">
                            Destino:
                          </span>
                          <span className="font-medium">
                            {quote.destination}
                          </span>
                          <span className="text-muted-foreground">
                            Distância:
                          </span>
                          <span className="font-medium">450 km (Est.)</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 text-primary">
                          <Package className="h-4 w-4" /> Carga
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Cliente:
                          </span>
                          <span className="font-medium">{quote.client}</span>
                          <span className="text-muted-foreground">Peso:</span>
                          <span className="font-medium">
                            {quote.weight.toLocaleString('pt-BR')} kg
                          </span>
                          <span className="text-muted-foreground">
                            Volumes:
                          </span>
                          <span className="font-medium">{quote.items}</span>
                          <span className="text-muted-foreground">Valor:</span>
                          <span className="font-medium">
                            {merchandiseValue.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2 text-primary">
                        <DollarSign className="h-4 w-4" /> Valores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground block mb-1">
                            Valor do Frete
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {quote.value.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground block mb-1">
                            Margem Estimada
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-2xl font-bold ${quote.margin < 10 ? 'text-red-600' : 'text-green-600'}`}
                            >
                              {quote.margin}%
                            </span>
                            <Progress
                              value={quote.margin}
                              className="w-20 h-2"
                              indicatorClassName={
                                quote.margin < 10
                                  ? 'bg-red-500'
                                  : 'bg-green-500'
                              }
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground block mb-1">
                            Custo Total
                          </span>
                          <span className="text-2xl font-bold">
                            {(
                              quote.value *
                              (1 - quote.margin / 100)
                            ).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="calculations" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Memória de Cálculo</CardTitle>
                      <CardDescription>
                        Detalhamento da composição do frete (AV2) e Margem
                        (BB2).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm py-2 border-b">
                          <span>Frete Base / Caminhão</span>
                          <span>
                            {baseFreight.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b">
                          <span>
                            Custos Operacionais (Carga/Descarga, Pedágio)
                          </span>
                          <span>
                            {operationalCostTotal.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b">
                          <span>Impostos (ICMS, ISS, PIS/COFINS)</span>
                          <span>
                            {taxCost.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b bg-muted/20 px-2">
                          <span className="font-medium">
                            Custo Total da Operação
                          </span>
                          <span className="font-medium">
                            {(
                              baseFreight +
                              operationalCostTotal +
                              taxCost
                            ).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-4 px-2 bg-primary/5 rounded-md py-2">
                          <span className="text-primary">
                            FRETE TOTAL (AV2)
                          </span>
                          <span className="text-primary">
                            {quote.value.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Linha do Tempo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {[
                          {
                            action: 'Cotação Criada',
                            user: 'João Silva',
                            time: '19/11/2025 14:30',
                          },
                          {
                            action: 'Análise de Crédito',
                            user: 'Sistema',
                            time: '19/11/2025 14:32',
                          },
                          {
                            action: 'Aprovação Comercial',
                            user: 'Maria Oliveira',
                            time: '19/11/2025 15:00',
                          },
                        ].map((event, i) => (
                          <div
                            key={i}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-primary group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border shadow-sm bg-card">
                              <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-slate-900">
                                  {event.action}
                                </div>
                                <time className="font-caveat font-medium text-indigo-500 text-xs">
                                  {event.time}
                                </time>
                              </div>
                              <div className="text-slate-500 text-sm">
                                Realizado por {event.user}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attachments" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos</CardTitle>
                      <CardDescription>
                        Arquivos relacionados a esta cotação.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {[
                          'Proposta_Comercial.pdf',
                          'Memoria_Calculo.xlsx',
                          'Comprovante_Entrega.jpg',
                        ].map((file, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{file}</p>
                                <p className="text-xs text-muted-foreground">
                                  2.4 MB • 19/11/2025
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="outline"
              onClick={() => onAction('renegotiate', quote)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Renegociar
            </Button>
            <Button
              variant="destructive"
              onClick={() => onAction('reject', quote)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reprovar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAction('approve', quote)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Aprovar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
