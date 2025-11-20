import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Truck, Box, Container } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { QuoteFormData } from '../../types'

interface Step1Props {
  data: QuoteFormData
  updateData: (data: Partial<QuoteFormData>) => void
}

const CITIES = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Porto Alegre, RS',
  'Salvador, BA',
  'Brasília, DF',
]

const CLIENTS = [
  'Tech Solutions SA',
  'Indústria Beta',
  'Comércio Global',
  'Agro Export',
  'Varejo Express',
]

export function Step1ShipmentData({ data, updateData }: Step1Props) {
  // Mock ICMS calculation
  useEffect(() => {
    if (data.origin && data.destination) {
      const originState = data.origin.split(', ')[1]
      const destState = data.destination.split(', ')[1]
      const newIcms = originState === destState ? 18 : 12
      if (newIcms !== data.icms) {
        updateData({ icms: newIcms })
      }
    }
  }, [data.origin, data.destination, data.icms, updateData])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Cliente</Label>
          <Select
            value={data.client}
            onValueChange={(val) => updateData({ client: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {CLIENTS.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data de Coleta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !data.collectionDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.collectionDate ? (
                  format(data.collectionDate, 'PPP', { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={data.collectionDate}
                onSelect={(date) => updateData({ collectionDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Origem</Label>
          <Select
            value={data.origin}
            onValueChange={(val) => updateData({ origin: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cidade de origem" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Destino</Label>
          <Select
            value={data.destination}
            onValueChange={(val) => updateData({ destination: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cidade de destino" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.icms > 0 && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100">
          Alíquota ICMS calculada: <strong>{data.icms}%</strong> ({data.origin}{' '}
          ➔ {data.destination})
        </div>
      )}

      <div className="space-y-3">
        <Label>Tipo de Carga</Label>
        <RadioGroup
          value={data.cargoType}
          onValueChange={(val: any) => updateData({ cargoType: val })}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="fracionada"
              id="fracionada"
              className="peer sr-only"
            />
            <Label
              htmlFor="fracionada"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <Box className="mb-3 h-6 w-6" />
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <Truck className="mb-3 h-6 w-6" />
              Lotação
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="container"
              id="container"
              className="peer sr-only"
            />
            <Label
              htmlFor="container"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
            >
              <Container className="mb-3 h-6 w-6" />
              Container
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Peso Bruto (kg)</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.weight || ''}
            onChange={(e) => updateData({ weight: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Valor Mercadoria (R$)</Label>
          <Input
            type="number"
            placeholder="0,00"
            value={data.merchandiseValue || ''}
            onChange={(e) =>
              updateData({ merchandiseValue: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Volumes</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.items || ''}
            onChange={(e) => updateData({ items: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dimensões (C x L x A em cm)</Label>
        <Input
          placeholder="Ex: 100 x 50 x 50"
          value={data.dimensions}
          onChange={(e) => updateData({ dimensions: e.target.value })}
        />
      </div>
    </div>
  )
}
