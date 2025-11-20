import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ReferenceTables() {
  const { toast } = useToast()

  const handleUpload = () => {
    toast({
      title: 'Upload Iniciado',
      description: 'Processando arquivo de tabela...',
    })
    setTimeout(() => {
      toast({
        title: 'Sucesso',
        description: 'Tabela atualizada com sucesso!',
      })
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Tabelas de Referência
        </h1>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" /> Importar Tabela
        </Button>
      </div>

      <Tabs defaultValue="ntc">
        <TabsList>
          <TabsTrigger value="ntc">Tabela NTC</TabsTrigger>
          <TabsTrigger value="icms">Matriz ICMS</TabsTrigger>
          <TabsTrigger value="generalities">Generalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="ntc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tabela NTC & Logística</CardTitle>
              <CardDescription>
                Valores de referência atualizados em Nov/2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faixa de Peso (kg)</TableHead>
                    <TableHead>Frete Valor (%)</TableHead>
                    <TableHead>Frete Peso (R$/kg)</TableHead>
                    <TableHead>Taxa Mínima (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Até 10kg</TableCell>
                    <TableCell>0.30%</TableCell>
                    <TableCell>R$ 1,50</TableCell>
                    <TableCell>R$ 45,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>11kg a 30kg</TableCell>
                    <TableCell>0.30%</TableCell>
                    <TableCell>R$ 1,20</TableCell>
                    <TableCell>R$ 55,00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>31kg a 100kg</TableCell>
                    <TableCell>0.30%</TableCell>
                    <TableCell>R$ 0,95</TableCell>
                    <TableCell>R$ 75,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="icms">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de ICMS Interestadual</CardTitle>
              <CardDescription>
                Alíquotas vigentes por estado de origem e destino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem \ Destino</TableHead>
                    <TableHead>SP</TableHead>
                    <TableHead>RJ</TableHead>
                    <TableHead>MG</TableHead>
                    <TableHead>RS</TableHead>
                    <TableHead>BA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">SP</TableCell>
                    <TableCell className="bg-muted">18%</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell>7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">RJ</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell className="bg-muted">20%</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell>7%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generalities">
          <Card>
            <CardHeader>
              <CardTitle>Taxas e Generalidades</CardTitle>
              <CardDescription>
                Custos adicionais e taxas administrativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor / Percentual</TableHead>
                    <TableHead>Incidência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GRIS (Gerenciamento de Risco)</TableCell>
                    <TableCell>0.30%</TableCell>
                    <TableCell>Sobre Valor da NF</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ad Valorem</TableCell>
                    <TableCell>0.40%</TableCell>
                    <TableCell>Sobre Valor da NF</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxa de Restrição de Trânsito (TRT)</TableCell>
                    <TableCell>20%</TableCell>
                    <TableCell>Sobre Frete Peso</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxa Administrativa (TAS)</TableCell>
                    <TableCell>R$ 5,50</TableCell>
                    <TableCell>Por CT-e</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
