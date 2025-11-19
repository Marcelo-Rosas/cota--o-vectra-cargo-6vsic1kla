import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2, Truck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function NewQuote() {
  const [step, setStep] = useState(1)
  const [pricingMode, setPricingMode] = useState('table')

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Cotação de Frete</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para calcular o frete.
            </CardDescription>
            <Progress value={step * 25} className="mt-2" />
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-medium">1. Dados do Embarque</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="c1">Tech Solutions SA</SelectItem>
                        <SelectItem value="c2">Indústria Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data do Embarque</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origem (CEP)</Label>
                    <Input placeholder="00000-000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Destino (CEP)</Label>
                    <Input placeholder="00000-000" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Peso Bruto (kg)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Mercadoria (R$)</Label>
                    <Input type="number" placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Volumes</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-medium">
                  2. Modalidade de Cálculo
                </h3>
                <RadioGroup
                  defaultValue="fracionada"
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="fracionada"
                      id="fracionada"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="fracionada"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Truck className="mb-3 h-6 w-6" />
                      Fracionada
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="lotacao"
                      id="lotacao"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="lotacao"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Truck className="mb-3 h-6 w-6" />
                      Lotação
                    </Label>
                  </div>
                </RadioGroup>
                <div className="space-y-2">
                  <Label>Tipo de Veículo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vuc">VUC</SelectItem>
                      <SelectItem value="toco">Toco</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="carreta">Carreta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-medium">
                  3. Parâmetros de Precificação
                </h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pricing-mode"
                    checked={pricingMode === 'manual'}
                    onCheckedChange={(c) =>
                      setPricingMode(c ? 'manual' : 'table')
                    }
                  />
                  <Label htmlFor="pricing-mode">Negociação Manual</Label>
                </div>
                {pricingMode === 'manual' ? (
                  <div className="space-y-4 border p-4 rounded-md">
                    <div className="space-y-2">
                      <Label>Frete Base Negociado (R$)</Label>
                      <Input type="number" placeholder="0,00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Markup Aplicado (%)</Label>
                      <Input type="number" placeholder="30" />
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Modo Automático</AlertTitle>
                    <AlertDescription>
                      O sistema utilizará as tabelas de referência vigentes para
                      calcular o frete.
                    </AlertDescription>
                  </Alert>
                )}
                <Button variant="outline" className="w-full">
                  Simular Frete Mínimo ANTT
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-medium">4. Revisão e Custos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Custos Operacionais
                    </span>
                    <p className="font-medium">R$ 1.250,00</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Impostos (ICMS/ISS)
                    </span>
                    <p className="font-medium">R$ 340,00</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Seguros (RCTR-C/RCF-DC)
                    </span>
                    <p className="font-medium">R$ 85,00</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Pedágios
                    </span>
                    <p className="font-medium">R$ 120,00</p>
                  </div>
                </div>
                <Separator />
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    A margem calculada está abaixo do ideal (25%). Considere
                    ajustar o markup.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              Voltar
            </Button>
            {step < 4 ? (
              <Button onClick={nextStep}>Próximo</Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700">
                Finalizar Cotação
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-20 border-primary/20 shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle>Preview da Cotação</CardTitle>
            <CardDescription>Atualizado em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete Base</span>
                <span>R$ 2.500,00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ad Valorem</span>
                <span>R$ 150,00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GRIS</span>
                <span>R$ 75,00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pedágio</span>
                <span>R$ 120,00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impostos</span>
                <span>R$ 340,00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ 3.185,00</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Análise de Viabilidade</h4>
              <div className="flex items-center justify-between text-sm">
                <span>Classificação</span>
                <span className="text-yellow-600 font-bold bg-yellow-100 px-2 py-0.5 rounded">
                  Viável
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Custo/Receita</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2 bg-secondary" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Gerar Proposta PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
