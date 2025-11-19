import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ReferenceTables() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">
        Tabelas de Referência
      </h1>

      <Tabs defaultValue="distances">
        <TabsList>
          <TabsTrigger value="distances">Distâncias</TabsTrigger>
          <TabsTrigger value="tolls">Pedágios</TabsTrigger>
        </TabsList>

        <TabsContent value="distances">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Distâncias</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Distância (KM)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>São Paulo, SP</TableCell>
                    <TableCell>Rio de Janeiro, RJ</TableCell>
                    <TableCell>435</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>São Paulo, SP</TableCell>
                    <TableCell>Curitiba, PR</TableCell>
                    <TableCell>408</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tolls">
          <Card>
            <CardHeader>
              <CardTitle>Tabela de Pedágios</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rodovia</TableHead>
                    <TableHead>Praça</TableHead>
                    <TableHead>Valor (Eixo)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>BR-116</TableCell>
                    <TableCell>Cajati</TableCell>
                    <TableCell>R$ 6,90</TableCell>
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
