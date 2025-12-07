import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { QuoteFormData } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileText, Save, Send, Printer } from 'lucide-react'

interface Step4Props {
  data: QuoteFormData
}

export function Step4Review({ data }: Step4Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Embarque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{data.client}</span>
              <span className="text-muted-foreground">Origem:</span>
              <span className="font-medium">{data.origin}</span>
              <span className="text-muted-foreground">Destino:</span>
              <span className="font-medium">{data.destination}</span>
              <span className="text-muted-foreground">Modalidade:</span>
              <span className="font-medium capitalize">{data.methodology}</span>
              <span className="text-muted-foreground">Distância:</span>
              <span className="font-medium">{data.distance} km</span>
              <span className="text-muted-foreground">Peso Real:</span>
              <span className="font-medium">{data.weight} kg</span>
              <span className="text-muted-foreground">Peso Cubado:</span>
              <span className="font-medium">
                {data.cubedWeight.toFixed(0)} kg
              </span>
              <span className="text-muted-foreground">Valor Mercadoria:</span>
              <span className="font-medium">
                {data.merchandiseValue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Frete Base:</span>
              <span className="font-medium">
                {data.baseFreight.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
              <span className="text-muted-foreground">
                Custos Operacionais:
              </span>
              <span className="font-medium">
                {data.operationalCostTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
              <span className="text-muted-foreground">Impostos:</span>
              <span className="font-medium">
                {data.taxCost.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
              <Separator className="col-span-2 my-2" />
              <span className="text-muted-foreground font-bold">
                Receita Final:
              </span>
              <span className="font-bold text-primary text-lg">
                {data.calculatedRevenue.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
              <span className="text-muted-foreground">Margem:</span>
              <span
                className={`font-bold ${data.grossMargin < 10 ? 'text-red-600' : 'text-green-600'}`}
              >
                {data.grossMargin.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label>Observações da Cotação</Label>
        <Textarea
          placeholder="Insira observações importantes sobre esta operação, restrições de entrega, etc..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button variant="outline" className="flex-1">
          <Save className="mr-2 h-4 w-4" /> Salvar Rascunho
        </Button>
        <Button variant="outline" className="flex-1">
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        <Button variant="outline" className="flex-1">
          <FileText className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Send className="mr-2 h-4 w-4" /> Enviar para Aprovação
        </Button>
      </div>
    </div>
  )
}
