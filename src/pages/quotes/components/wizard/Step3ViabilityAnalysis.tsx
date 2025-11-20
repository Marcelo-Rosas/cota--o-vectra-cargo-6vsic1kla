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
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Step3Props {
  data: QuoteFormData
}

const COLORS = ['#1E40AF', '#10B981', '#F59E0B', '#EF4444']

export function Step3ViabilityAnalysis({ data }: Step3Props) {
  const chartData = [
    { name: 'Frete Base', value: data.baseFreight },
    { name: 'Custos Operacionais', value: data.operationalCostTotal },
    { name: 'Impostos', value: data.taxCost },
    {
      name: 'Margem',
      value: data.grossMarginValue > 0 ? data.grossMarginValue : 0,
    },
  ].filter((item) => item.value > 0)

  const breakdownData = [
    { name: 'Frete Caminhão', value: data.baseFreight },
    { name: 'Frete Valor', value: data.merchandiseValue * 0.003 }, // Mock Ad Valorem
    { name: 'GRIS', value: data.merchandiseValue * 0.002 }, // Mock GRIS
    { name: 'Taxas', value: data.loadingCost + data.equipmentCost },
  ]

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Excelente':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'Viável':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'Recusar':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              FRETE TOTAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.calculatedRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <p className="text-xs opacity-80">Preço final sugerido</p>
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
        <Card
          className={`border-2 ${getClassificationColor(data.classification)}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.classification}</div>
            <p className="text-xs opacity-80">Baseado na margem</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Composição de Custos</CardTitle>
            <CardDescription>
              Distribuição percentual dos valores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
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
              <CardTitle>Detalhamento de Receitas</CardTitle>
              <CardDescription>
                Breakdown dos componentes do frete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="value"
                      fill="#1E40AF"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
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
                  <span>Markup Ideal (Benchmark)</span>
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
            A margem bruta calculada é inferior a 10%. A operação pode não ser
            viável financeiramente. Recomenda-se revisar os custos ou ajustar o
            markup.
          </AlertDescription>
        </Alert>
      )}

      {data.grossMargin >= 10 && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Validado</AlertTitle>
          <AlertDescription>
            Base de cálculo ICMS conforme receita. Operação dentro dos
            parâmetros de segurança.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
