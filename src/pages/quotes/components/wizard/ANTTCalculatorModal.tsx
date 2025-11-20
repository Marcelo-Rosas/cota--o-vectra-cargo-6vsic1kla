import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calculator } from 'lucide-react'

interface ANTTCalculatorModalProps {
  onCalculate: (value: number) => void
}

export function ANTTCalculatorModal({ onCalculate }: ANTTCalculatorModalProps) {
  const [open, setOpen] = useState(false)
  const [distance, setDistance] = useState('')
  const [axles, setAxles] = useState('2')
  const [type, setType] = useState('general')

  const handleCalculate = () => {
    // Mock calculation logic based on ANTT rules
    const dist = Number(distance)
    const axleCount = Number(axles)
    let rate = 1.5 // R$ per km per axle (mock)

    if (type === 'dangerous') rate = 2.0
    if (type === 'refrigerated') rate = 1.8

    const result = dist * axleCount * rate
    onCalculate(result)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calculator className="mr-2 h-4 w-4" />
          Calculadora ANTT Integrada
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Calculadora de Frete Mínimo ANTT</DialogTitle>
          <DialogDescription>
            Calcule o piso mínimo de frete conforme resolução vigente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="distance" className="text-right">
              Distância (km)
            </Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="axles" className="text-right">
              Eixos
            </Label>
            <Select value={axles} onValueChange={setAxles}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Eixos (Toco)</SelectItem>
                <SelectItem value="3">3 Eixos (Truck)</SelectItem>
                <SelectItem value="4">4 Eixos (Bitruck)</SelectItem>
                <SelectItem value="5">5 Eixos (Carreta)</SelectItem>
                <SelectItem value="6">6 Eixos (Carreta LS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo Carga
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Carga Geral</SelectItem>
                <SelectItem value="bulk">Granel</SelectItem>
                <SelectItem value="refrigerated">Frigorificada</SelectItem>
                <SelectItem value="dangerous">Perigosa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCalculate}>Calcular e Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
