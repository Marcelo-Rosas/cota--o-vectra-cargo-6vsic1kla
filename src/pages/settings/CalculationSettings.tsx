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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export default function CalculationSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        Configurações de Cálculo
      </h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="taxes">Impostos</TabsTrigger>
          <TabsTrigger value="costs">Custos Operacionais</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros Globais</CardTitle>
              <CardDescription>
                Definições padrão para todos os cálculos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Margem de Lucro Mínima (%)</Label>
                  <Input type="number" defaultValue={20} />
                </div>
                <div className="space-y-2">
                  <Label>Índice Custo/Receita Ideal (%)</Label>
                  <Input type="number" defaultValue={65} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Bloquear cotações com margem negativa</Label>
                  <p className="text-sm text-muted-foreground">
                    Impede o envio de cotações com prejuízo para aprovação
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alíquotas Padrão</CardTitle>
              <CardDescription>
                Configuração de impostos e taxas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ICMS Padrão (%)</Label>
                  <Input type="number" defaultValue={12} />
                </div>
                <div className="space-y-2">
                  <Label>ISS (%)</Label>
                  <Input type="number" defaultValue={5} />
                </div>
                <div className="space-y-2">
                  <Label>GRIS (%)</Label>
                  <Input type="number" defaultValue={0.3} />
                </div>
                <div className="space-y-2">
                  <Label>Ad Valorem (%)</Label>
                  <Input type="number" defaultValue={0.5} />
                </div>
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custos Fixos e Variáveis</CardTitle>
              <CardDescription>
                Base de custos para cálculo de viabilidade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Custo Combustível (R$/L)</Label>
                <Input type="number" defaultValue={5.89} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Custo Manutenção (R$/km)</Label>
                <Input type="number" defaultValue={0.85} />
              </div>
              <Button className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
