import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Box, Calculator, RotateCcw, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Types & Constants
type CalculationMethod = 'equivalent' | 'typical' | 'custom' | 'fixed'

interface CalculationItem {
  id: string
  volume: number | ''
  method: CalculationMethod
  // Method 2 & 3
  ratioType?: string
  // Method 4
  fixedDimensionValue?: number | ''
  fixedRatio?: string
}

interface CalculatedDimensions {
  length: number
  width: number
  height: number
  recalculatedVolume: number
}

const TYPICAL_RATIOS = {
  fitness: { label: 'Equipamento Fitness', ratio: [2.0, 1.2, 1.0] },
  palete: { label: 'Palete Padrão', ratio: [1.2, 1.0, 1.0] },
  caixa: { label: 'Caixa de Papelão', ratio: [1.5, 1.0, 0.8] },
  eletro: { label: 'Eletrodoméstico', ratio: [1.3, 1.0, 1.2] },
  moveis: { label: 'Móveis', ratio: [1.8, 1.0, 1.0] },
} as const

const CUSTOM_RATIOS = {
  abdutor: { label: 'Abdutor/Adução', ratio: [1.8, 1.0, 1.4] },
  abdominal: { label: 'Abdominal', ratio: [1.5, 1.0, 1.2] },
  legpress: { label: 'Leg Press', ratio: [2.2, 1.2, 1.0] },
  puxador: { label: 'Puxador Alto', ratio: [2.0, 1.0, 1.8] },
  remada: { label: 'Remada', ratio: [2.0, 1.1, 1.3] },
  supino: { label: 'Supino', ratio: [2.0, 1.5, 1.2] },
  bicicleta: { label: 'Bicicleta Erg.', ratio: [1.2, 0.6, 1.3] },
  esteira: { label: 'Esteira', ratio: [2.2, 0.9, 1.4] },
} as const

const FIXED_RATIOS = [
  { label: '1:1 (Quadrado)', value: '1:1', ratio: 1.0 },
  { label: '1.2:1 (Retangular Leve)', value: '1.2:1', ratio: 1.2 },
  { label: '1.5:1 (Retangular Médio)', value: '1.5:1', ratio: 1.5 },
  { label: '2:1 (Retangular Longo)', value: '2:1', ratio: 2.0 },
]

export default function ReverseCubage() {
  const { toast } = useToast()
  const [items, setItems] = useState<CalculationItem[]>([
    {
      id: '1',
      volume: '',
      method: 'equivalent',
      ratioType: 'fitness',
      fixedDimensionValue: '',
      fixedRatio: '1.5:1',
    },
  ])
  const [showInCm, setShowInCm] = useState(false)

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 11),
        volume: '',
        method: 'equivalent',
        ratioType: 'fitness', // Default for methods 2 & 3
        fixedDimensionValue: '',
        fixedRatio: '1.5:1',
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      // If removing last item, just reset it
      setItems([
        {
          id: Math.random().toString(36).slice(2, 11),
          volume: '',
          method: 'equivalent',
          ratioType: 'fitness',
          fixedDimensionValue: '',
          fixedRatio: '1.5:1',
        },
      ])
    }
  }

  const updateItem = (id: string, updates: Partial<CalculationItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }

  const calculateDimensions = (
    item: CalculationItem,
  ): CalculatedDimensions | null => {
    if (!item.volume || item.volume <= 0) return null

    const volume = Number(item.volume)
    let C = 0,
      L = 0,
      A = 0

    switch (item.method) {
      case 'equivalent': {
        // C = L = A = ³√Volume
        const dimension = Math.cbrt(volume)
        C = L = A = dimension
        break
      }

      case 'typical':
      case 'custom': {
        let selectedRatio: readonly [number, number, number] | undefined

        if (item.method === 'typical') {
          const key = item.ratioType as keyof typeof TYPICAL_RATIOS
          selectedRatio = TYPICAL_RATIOS[key]?.ratio
        } else {
          const key = item.ratioType as keyof typeof CUSTOM_RATIOS
          selectedRatio = CUSTOM_RATIOS[key]?.ratio
        }

        if (selectedRatio) {
          const [rC, rL, rA] = selectedRatio
          const product = rC * rL * rA
          const k = Math.cbrt(volume / product)
          C = rC * k
          L = rL * k
          A = rA * k
        }
        break
      }

      case 'fixed': {
        if (
          !item.fixedDimensionValue ||
          Number(item.fixedDimensionValue) <= 0
        ) {
          return null
        }
        const fixedH = Number(item.fixedDimensionValue)
        const ratioObj = FIXED_RATIOS.find((r) => r.value === item.fixedRatio)
        const ratio = ratioObj ? ratioObj.ratio : 1.5

        // Area_Base = V / Fixed_H
        const areaBase = volume / fixedH
        // C / L = ratio => C = ratio * L
        // Area = C * L = ratio * L^2
        // L = sqrt(Area / ratio)
        L = Math.sqrt(areaBase / ratio)
        C = ratio * L
        A = fixedH
        break
      }
    }

    return {
      length: C,
      width: L,
      height: A,
      recalculatedVolume: C * L * A,
    }
  }

  const formatDimension = (val: number) => {
    return showInCm ? (val * 100).toFixed(0) + ' cm' : val.toFixed(2) + ' m'
  }

  const getRecalculatedDifference = (original: number, calculated: number) => {
    const diff = Math.abs(original - calculated)
    const percent = (diff / original) * 100
    return percent
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Calculator className="h-8 w-8" /> Calculadora de Cubagem Reversa
          </h1>
          <p className="text-muted-foreground mt-1">
            Estime as dimensões físicas (C x L x A) de cargas baseando-se apenas
            no volume total.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 rounded-lg border shadow-sm">
          <Label htmlFor="unit-toggle" className="text-sm font-medium">
            Unidade:
          </Label>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm',
                !showInCm ? 'font-bold text-primary' : 'text-muted-foreground',
              )}
            >
              Metros (m)
            </span>
            <Switch
              id="unit-toggle"
              checked={showInCm}
              onCheckedChange={setShowInCm}
            />
            <span
              className={cn(
                'text-sm',
                showInCm ? 'font-bold text-primary' : 'text-muted-foreground',
              )}
            >
              Centímetros (cm)
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Itens para Cálculo</CardTitle>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Item
            </Button>
          </div>
          <CardDescription>
            Adicione múltiplos itens para calcular dimensões simultaneamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px]">Volume (m³)</TableHead>
                  <TableHead className="w-[200px]">Método</TableHead>
                  <TableHead className="min-w-[200px]">Parâmetros</TableHead>
                  <TableHead className="w-[250px]">
                    Dimensões Estimadas
                    <br />
                    <span className="text-xs font-normal text-muted-foreground">
                      (Comprimento x Largura x Altura)
                    </span>
                  </TableHead>
                  <TableHead className="w-[150px]">Validação</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const result = calculateDimensions(item)
                  const diffPercent =
                    result && item.volume
                      ? getRecalculatedDifference(
                          Number(item.volume),
                          result.recalculatedVolume,
                        )
                      : 0
                  const isValid = diffPercent < 5

                  return (
                    <TableRow key={item.id} className="group">
                      <TableCell className="align-top pt-4">
                        <div className="space-y-1">
                          <Input
                            type="number"
                            placeholder="Ex: 5.985"
                            value={item.volume}
                            onChange={(e) => {
                              const val = e.target.value
                              updateItem(item.id, {
                                volume: val === '' ? '' : parseFloat(val),
                              })
                            }}
                            className={cn(
                              'font-medium',
                              item.volume &&
                                Number(item.volume) <= 0 &&
                                'border-destructive focus-visible:ring-destructive',
                            )}
                          />
                          {item.volume && Number(item.volume) <= 0 && (
                            <span className="text-xs text-destructive">
                              Inválido
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <Select
                          value={item.method}
                          onValueChange={(val: CalculationMethod) =>
                            updateItem(item.id, {
                              method: val,
                              // Reset related fields
                              ratioType:
                                val === 'typical' ? 'fitness' : 'abdutor',
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equivalent">
                              1. Cubo Equivalente
                            </SelectItem>
                            <SelectItem value="typical">
                              2. Proporção Típica
                            </SelectItem>
                            <SelectItem value="custom">
                              3. Proporção Customizada
                            </SelectItem>
                            <SelectItem value="fixed">
                              4. Dimensão Fixa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        {item.method === 'equivalent' && (
                          <div className="text-sm text-muted-foreground italic py-2">
                            C = L = A = ³√Volume
                          </div>
                        )}

                        {(item.method === 'typical' ||
                          item.method === 'custom') && (
                          <div className="space-y-2">
                            <Select
                              value={item.ratioType}
                              onValueChange={(val) =>
                                updateItem(item.id, { ratioType: val })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {item.method === 'typical'
                                  ? Object.entries(TYPICAL_RATIOS).map(
                                      ([key, { label, ratio }]) => (
                                        <SelectItem key={key} value={key}>
                                          {label} ({ratio.join(':')})
                                        </SelectItem>
                                      ),
                                    )
                                  : Object.entries(CUSTOM_RATIOS).map(
                                      ([key, { label, ratio }]) => (
                                        <SelectItem key={key} value={key}>
                                          {label} ({ratio.join(':')})
                                        </SelectItem>
                                      ),
                                    )}
                              </SelectContent>
                            </Select>
                            {item.method === 'custom' && (
                              <Badge variant="secondary" className="text-xs">
                                Equip. Fitness Específico
                              </Badge>
                            )}
                          </div>
                        )}

                        {item.method === 'fixed' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Alt. Fixa (m)"
                                value={item.fixedDimensionValue}
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    fixedDimensionValue:
                                      e.target.value === ''
                                        ? ''
                                        : parseFloat(e.target.value),
                                  })
                                }
                                className="w-24"
                              />
                              <Select
                                value={item.fixedRatio}
                                onValueChange={(val) =>
                                  updateItem(item.id, { fixedRatio: val })
                                }
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FIXED_RATIOS.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                      {r.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {!item.fixedDimensionValue && (
                              <p className="text-xs text-orange-600 flex items-center gap-1">
                                <Info className="h-3 w-3" /> Informe a altura
                                fixa
                              </p>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        {result ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-mono font-medium text-lg text-primary bg-primary/5 p-2 rounded border border-primary/20">
                              <Box className="h-4 w-4" />
                              <span>{formatDimension(result.length)}</span>
                              <span className="text-muted-foreground">x</span>
                              <span>{formatDimension(result.width)}</span>
                              <span className="text-muted-foreground">x</span>
                              <span>{formatDimension(result.height)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                              <span>Comp.</span>
                              <span>Larg.</span>
                              <span>Alt.</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-10 text-muted-foreground text-sm">
                            -
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        {result ? (
                          <div className="space-y-1">
                            <div
                              className={cn(
                                'text-sm font-medium',
                                isValid ? 'text-green-600' : 'text-red-600',
                              )}
                            >
                              {result.recalculatedVolume.toFixed(4)} m³
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={isValid ? 'outline' : 'destructive'}
                                className={cn(
                                  'text-[10px] h-4 px-1',
                                  isValid
                                    ? 'border-green-200 text-green-700 bg-green-50'
                                    : '',
                                )}
                              >
                                {diffPercent.toFixed(2)}% dev.
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">-</div>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="opacity-50 hover:opacity-100 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-muted/20 border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Sobre os Métodos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">1. Cubo Equivalente:</strong>{' '}
              Assume que a carga é um cubo perfeito. Útil para estimativas
              rápidas sem informação de forma.
            </p>
            <p>
              <strong className="text-foreground">2. Proporção Típica:</strong>{' '}
              Utiliza médias de mercado para categorias comuns (ex: Paletes,
              Móveis).
            </p>
            <p>
              <strong className="text-foreground">
                3. Proporção Customizada:
              </strong>{' '}
              Algoritmo específico para equipamentos de academia com formatos
              irregulares.
            </p>
            <p>
              <strong className="text-foreground">4. Dimensão Fixa:</strong>{' '}
              Ideal quando uma medida é limitada pelo veículo (ex: Altura máxima
              da porta) e se deseja calcular a área de piso.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exemplo Prático</CardTitle>
            <CardDescription>
              Teste com: Volume <strong>5.985 m³</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm p-2 bg-muted rounded">
              <span>Equip. Fitness (Método 2)</span>
              <span className="font-mono font-bold">2.71 x 1.63 x 1.36 m</span>
            </div>
            <div className="flex items-center justify-between text-sm p-2 bg-muted rounded">
              <span>Puxador Alto (Método 3)</span>
              <span className="font-mono font-bold">2.37 x 1.19 x 2.13 m</span>
            </div>
            <div className="flex items-center justify-between text-sm p-2 bg-muted rounded">
              <span>Fixa: Alt 1.5m, 1.5:1 (Método 4)</span>
              <span className="font-mono font-bold">2.45 x 1.63 x 1.50 m</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                setItems((prev) => [
                  ...prev,
                  {
                    id: Math.random().toString(36).slice(2, 11),
                    volume: 5.985,
                    method: 'typical',
                    ratioType: 'fitness',
                    fixedDimensionValue: '',
                    fixedRatio: '1.5:1',
                  },
                ])
                toast({
                  title: 'Exemplo Carregado',
                  description:
                    'Item adicionado à lista com volume de 5.985 m³.',
                })
              }}
            >
              <RotateCcw className="mr-2 h-3 w-3" /> Carregar este Exemplo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
