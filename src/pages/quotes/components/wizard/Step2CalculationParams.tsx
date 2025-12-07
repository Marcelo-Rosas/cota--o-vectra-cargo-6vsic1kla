import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuoteFormData } from '../../types'
import { ANTTCalculatorModal } from './ANTTCalculatorModal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Info, CheckCircle2, Truck, Box } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Step2Props {
  data: QuoteFormData
  updateData: (data: Partial<QuoteFormData>) => void
}

export function Step2CalculationParams({ data, updateData }: Step2Props) {
  const isRecommended = (method: string) =>
    data.recommendedMethodology === method

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Methodology Decision Tree Result */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Análise de Metodologia e Custos
        </h3>

        <Alert
          className={cn(
            'border-l-4',
            data.recommendedMethodology === 'lotacao'
              ? 'border-l-blue-600'
              : 'border-l-green-600',
          )}
        >
          {data.recommendedMethodology === 'lotacao' ? (
            <Truck className="h-4 w-4" />
          ) : (
            <Box className="h-4 w-4" />
          )}
          <AlertTitle className="flex items-center gap-2">
            Recomendação:{' '}
            {data.recommendedMethodology === 'lotacao'
              ? 'Carga Lotação (Veículo Dedicado)'
              : 'Carga Fracionada'}
          </AlertTitle>
          <AlertDescription>
            Com base no peso ({data.weight}kg), cubagem (
            {data.cubage.toFixed(2)}m³) e urgência ({data.urgency}), esta é a
            modalidade mais eficiente.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className={cn(
              'cursor-pointer border-2 transition-all hover:border-primary/50',
              data.methodology === 'fracionada'
                ? 'border-primary bg-primary/5'
                : 'border-border',
            )}
            onClick={() => updateData({ methodology: 'fracionada' })}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Fracionado</h4>
                  {isRecommended('fracionada') && (
                    <Badge className="bg-green-600">Recomendado</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Prazo estimado: {data.timeFracionado} dias
                </p>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-primary">
                  {data.costFracionado.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
                <span className="text-xs text-muted-foreground">
                  Custo Base
                </span>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              'cursor-pointer border-2 transition-all hover:border-primary/50',
              data.methodology === 'lotacao'
                ? 'border-primary bg-primary/5'
                : 'border-border',
            )}
            onClick={() => updateData({ methodology: 'lotacao' })}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Lotação</h4>
                  {isRecommended('lotacao') && (
                    <Badge className="bg-blue-600">Recomendado</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Prazo estimado: {data.timeLotacao} dias
                </p>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-primary">
                  {data.costLotacao.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
                <span className="text-xs text-muted-foreground">
                  Custo Base
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-base">Usar Tabela NTC / ANTT</Label>
              <p className="text-sm text-muted-foreground">
                Utilizar valores de referência calculados
              </p>
            </div>
            <Switch
              checked={data.useNtcTable}
              onCheckedChange={(checked) =>
                updateData({ useNtcTable: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Metodologia Selecionada</Label>
            <Select
              value={data.methodology}
              onValueChange={(val: any) => updateData({ methodology: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fracionada">Carga Fracionada</SelectItem>
                <SelectItem value="lotacao">Carga Lotação</SelectItem>
                <SelectItem value="container">Container</SelectItem>
                <SelectItem value="antt">Frete Mínimo ANTT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.methodology === 'antt' && (
            <ANTTCalculatorModal
              onCalculate={(val) =>
                updateData({
                  baseFreight: val,
                  useNtcTable: false,
                })
              }
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="taxes-switch">Aplicar Impostos em Custos</Label>
              <p className="text-sm text-muted-foreground">
                Adicionar custos operacionais à base de cálculo
              </p>
            </div>
            <Switch
              id="taxes-switch"
              checked={data.applyTaxesOnCosts}
              onCheckedChange={(checked) =>
                updateData({ applyTaxesOnCosts: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="markup-switch">Aplicar Markup</Label>
              <p className="text-sm text-muted-foreground">
                Calcular preço baseado em margem sobre custos
              </p>
            </div>
            <Switch
              id="markup-switch"
              checked={data.applyMarkup}
              onCheckedChange={(checked) =>
                updateData({ applyMarkup: checked })
              }
            />
          </div>
        </div>
      </div>

      {!data.applyMarkup && (
        <Alert
          variant="destructive"
          className="bg-red-50 border-red-200 text-red-800"
        >
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            O markup está desativado. É <strong>obrigatório</strong> informar o
            Frete Negociado abaixo para prosseguir.
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4" /> Composição de Custos Operacionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Frete Caminhão / Base (R$)</Label>
            <Input
              type="number"
              value={data.baseFreight || ''}
              onChange={(e) =>
                updateData({
                  baseFreight: Number(e.target.value),
                  useNtcTable: false,
                })
              }
              placeholder="0,00"
              className={cn(
                data.useNtcTable && 'bg-muted text-muted-foreground',
              )}
              readOnly={data.useNtcTable}
            />
          </div>

          <div className="space-y-2">
            <Label>Custos Carga/Descarga (R$)</Label>
            <Input
              type="number"
              value={data.loadingCost || ''}
              onChange={(e) =>
                updateData({ loadingCost: Number(e.target.value) })
              }
              placeholder="0,00"
            />
          </div>
          <div className="space-y-2">
            <Label>Aluguel Equipamentos (R$)</Label>
            <Input
              type="number"
              value={data.equipmentCost || ''}
              onChange={(e) =>
                updateData({ equipmentCost: Number(e.target.value) })
              }
              placeholder="0,00"
            />
          </div>
          <div className="space-y-2">
            <Label>Pedágio (R$)</Label>
            <Input
              type="number"
              value={data.tollCost || ''}
              onChange={(e) => updateData({ tollCost: Number(e.target.value) })}
              placeholder="0,00"
            />
          </div>

          {data.applyMarkup ? (
            <div className="space-y-2">
              <Label className="text-primary font-bold">
                Markup Desejado (%)
              </Label>
              <Input
                type="number"
                value={data.markupPercentage || ''}
                onChange={(e) =>
                  updateData({ markupPercentage: Number(e.target.value) })
                }
                placeholder="30"
                className="border-primary/30 bg-primary/5"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-blue-600 font-bold">
                Frete Negociado (R$)
              </Label>
              <Input
                type="number"
                value={data.negotiatedFreight || ''}
                onChange={(e) =>
                  updateData({ negotiatedFreight: Number(e.target.value) })
                }
                placeholder="0,00"
                className="border-blue-200 bg-blue-50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
