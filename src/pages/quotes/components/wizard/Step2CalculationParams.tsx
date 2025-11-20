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
import { AlertTriangle } from 'lucide-react'

interface Step2Props {
  data: QuoteFormData
  updateData: (data: Partial<QuoteFormData>) => void
}

export function Step2CalculationParams({ data, updateData }: Step2Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
        <div className="space-y-0.5">
          <Label className="text-base">Usar Tabela NTC</Label>
          <p className="text-sm text-muted-foreground">
            Utilizar valores de referência da NTC & Logística
          </p>
        </div>
        <Switch
          checked={data.useNtcTable}
          onCheckedChange={(checked) => updateData({ useNtcTable: checked })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Metodologia de Cálculo</Label>
          <Select
            value={data.methodology}
            onValueChange={(val) => updateData({ methodology: val })}
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

        <div className="flex items-end">
          <ANTTCalculatorModal
            onCalculate={(val) =>
              updateData({
                baseFreight: val,
                useNtcTable: false,
                methodology: 'antt',
              })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-3 border rounded-md">
          <Label htmlFor="taxes-switch">Aplicar Impostos em Custos</Label>
          <Switch
            id="taxes-switch"
            checked={data.applyTaxesOnCosts}
            onCheckedChange={(checked) =>
              updateData({ applyTaxesOnCosts: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between p-3 border rounded-md">
          <Label htmlFor="markup-switch">Aplicar Markup</Label>
          <Switch
            id="markup-switch"
            checked={data.applyMarkup}
            onCheckedChange={(checked) => updateData({ applyMarkup: checked })}
          />
        </div>
      </div>

      {!data.applyMarkup && !data.negotiatedFreight && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            O markup está desativado. É necessário informar o Frete Negociado
            abaixo.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Composição de Custos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!data.useNtcTable && (
            <div className="space-y-2">
              <Label>Frete Caminhão / Base (R$)</Label>
              <Input
                type="number"
                value={data.baseFreight || ''}
                onChange={(e) =>
                  updateData({ baseFreight: Number(e.target.value) })
                }
                placeholder="0,00"
              />
            </div>
          )}
          {!data.applyMarkup && (
            <div className="space-y-2">
              <Label className="text-blue-600">Frete Negociado (R$)</Label>
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
          {data.applyMarkup && (
            <div className="space-y-2">
              <Label>Markup (%)</Label>
              <Input
                type="number"
                value={data.markupPercentage || ''}
                onChange={(e) =>
                  updateData({ markupPercentage: Number(e.target.value) })
                }
                placeholder="30"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
