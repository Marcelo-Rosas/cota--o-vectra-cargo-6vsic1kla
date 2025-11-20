import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Download } from 'lucide-react'

const data = [
  { name: 'Jan', receita: 4000, custo: 2400, lucro: 1600 },
  { name: 'Fev', receita: 3000, custo: 1398, lucro: 1602 },
  { name: 'Mar', receita: 2000, custo: 9800, lucro: -7800 },
  { name: 'Abr', receita: 2780, custo: 3908, lucro: -1128 },
  { name: 'Mai', receita: 1890, custo: 4800, lucro: -2910 },
  { name: 'Jun', receita: 2390, custo: 3800, lucro: -1410 },
]

export default function ProfitabilityReport() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Relatório de Rentabilidade
        </h1>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise Financeira</CardTitle>
          <CardDescription>
            Comparativo de Receita, Custo e Lucro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              receita: { label: 'Receita', color: 'hsl(var(--chart-1))' },
              custo: { label: 'Custo', color: 'hsl(var(--chart-5))' },
              lucro: { label: 'Lucro', color: 'hsl(var(--chart-2))' },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  dataKey="receita"
                  fill="var(--color-receita)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="custo"
                  fill="var(--color-custo)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="lucro"
                  fill="var(--color-lucro)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
