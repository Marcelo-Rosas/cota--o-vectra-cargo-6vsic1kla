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

export default function TaxModule() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Módulo Tributário</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calculadora ICMS Interestadual</CardTitle>
            <CardDescription>
              Simule a alíquota e valor de ICMS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>UF Origem</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>UF Destino</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MG">MG</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Valor da Mercadoria</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <Button className="w-full">Calcular ICMS</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cálculo DAS Simples Nacional</CardTitle>
            <CardDescription>Estimativa de imposto unificado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Faturamento Mensal</Label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <Label>Anexo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="III">Anexo III</SelectItem>
                  <SelectItem value="IV">Anexo IV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" variant="secondary">
              Calcular DAS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
