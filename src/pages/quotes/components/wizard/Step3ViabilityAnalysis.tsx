import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { QuoteFormData } from '../../types'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from 'recharts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Step3Props {
  data: QuoteFormData
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function Step3ViabilityAnalysis({ data }: Step3Props) {
  const chartData = [
    { name: 'Frete Base', value: data.baseFreight },
    { name: 'Custos Operacionais', value: data.totalCosts - data.baseFreight },
    { name: 'Impostos', value: data.calculatedRevenue * 0.18 }, // Mock tax
    { name: 'Margem', value: data.grossMarginValue },
  ].filter((item) => item.value > 0)

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Excelente':
        return 'text-green-600'
      case 'Viável':
        return 'text-yellow-600'
      case 'Recusar':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Calculada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.calculatedRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor final sugerido
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalCosts.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Operacional + Impostos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Margem Bruta</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${data.grossMargin < 10 ? 'text-red-500' : 'text-green-500'}`}
            >
              {data.grossMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.grossMarginValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Composição de Custos</CardTitle>
            <CardDescription>Distribuição dos valores</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Classificação Automática</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div
                className={`text-4xl font-bold mb-2 ${getClassificationColor(data.classification)}`}
              >
                {data.classification}
              </div>
              <p className="text-center text-muted-foreground">
                Com base na margem e riscos operacionais.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparador de Markup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Markup Atual</span>
                  <span className="font-bold">{data.markupPercentage}%</span>
                </div>
                <Progress value={data.markupPercentage} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Markup Ideal</span>
                  <span className="font-bold text-muted-foreground">35%</span>
                </div>
                <Progress value={35} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {data.grossMargin < 10 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>ALERTA DE VIABILIDADE</AlertTitle>
          <AlertDescription>
            A margem bruta calculada é inferior a 10%. Recomenda-se revisar os
            custos ou ajustar o markup.
          </AlertDescription>
        </Alert>
      )}

      {data.grossMargin >= 10 && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Validado</AlertTitle>
          <AlertDescription>
            A base de cálculo ICMS está consistente com a receita calculada.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
