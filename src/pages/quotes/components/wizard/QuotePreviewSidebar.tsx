import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { QuoteFormData } from '../../types'
import { FileText } from 'lucide-react'

interface SidebarProps {
  data: QuoteFormData
}

export function QuotePreviewSidebar({ data }: SidebarProps) {
  return (
    <Card className="sticky top-20 border-primary/20 shadow-lg">
      <CardHeader className="bg-muted/50">
        <CardTitle>Preview Rápido</CardTitle>
        <CardDescription>Atualizado em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cliente</span>
            <span className="font-medium truncate max-w-[150px]">
              {data.client || '-'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rota</span>
            <span className="font-medium truncate max-w-[150px]">
              {data.origin && data.destination
                ? `${data.origin.split(',')[0]} -> ${data.destination.split(',')[0]}`
                : '-'}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Frete Base</span>
            <span>
              {data.baseFreight.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Custos Extras</span>
            <span>
              {(
                data.loadingCost +
                data.equipmentCost +
                data.tollCost
              ).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Impostos (Est.)</span>
            <span>
              {(data.calculatedRevenue * 0.18).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">
              {data.calculatedRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Viabilidade</h4>
          <div className="flex items-center justify-between text-sm">
            <span>Classificação</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-xs ${
                data.classification === 'Excelente'
                  ? 'bg-green-100 text-green-700'
                  : data.classification === 'Viável'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {data.classification}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Margem</span>
              <span>{data.grossMargin.toFixed(1)}%</span>
            </div>
            <Progress
              value={data.grossMargin}
              className="h-2"
              indicatorClassName={
                data.grossMargin < 10 ? 'bg-red-500' : 'bg-green-500'
              }
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" disabled>
          <FileText className="mr-2 h-4 w-4" /> Gerar Proposta PDF
        </Button>
      </CardFooter>
    </Card>
  )
}
