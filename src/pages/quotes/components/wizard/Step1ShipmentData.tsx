import { useEffect, useState } from 'react'
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
import {
  CalendarIcon,
  Truck,
  Box,
  Container,
  Search,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { QuoteFormData } from '../../types'
import { useToast } from '@/hooks/use-toast'

interface Step1Props {
  data: QuoteFormData
  updateData: (data: Partial<QuoteFormData>) => void
}

const CLIENTS = [
  'Tech Solutions SA',
  'Indústria Beta',
  'Comércio Global',
  'Agro Export',
  'Varejo Express',
]

export function Step1ShipmentData({ data, updateData }: Step1Props) {
  const { toast } = useToast()
  const [loadingCepOrigin, setLoadingCepOrigin] = useState(false)
  const [loadingCepDest, setLoadingCepDest] = useState(false)

  const fetchAddress = async (cep: string, field: 'origin' | 'destination') => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    const setLoading =
      field === 'origin' ? setLoadingCepOrigin : setLoadingCepDest
    setLoading(true)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const addressData = await response.json()

      if (addressData.erro) {
        toast({
          title: 'CEP não encontrado',
          description: 'Verifique o CEP informado e tente novamente.',
          variant: 'destructive',
        })
        return
      }

      const cityState = `${addressData.localidade}, ${addressData.uf}`

      if (field === 'origin') {
        updateData({ origin: cityState, originCep: cep })
      } else {
        updateData({ destination: cityState, destinationCep: cep })
      }

      toast({
        title: 'Endereço localizado',
        description: `${cityState} definido como ${field === 'origin' ? 'Origem' : 'Destino'}.`,
      })
    } catch (error) {
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível buscar o endereço.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Mock ICMS calculation
  useEffect(() => {
    if (data.origin && data.destination) {
      const originState = data.origin.split(', ')[1]
      const destState = data.destination.split(', ')[1]
      // Simple logic: Intra-state = 18%, Inter-state = 12% (simplified)
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
              <SelectValue placeholder="Selecione ou digite o cliente" />
            </SelectTrigger>
            <SelectContent>
              {CLIENTS.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
              <SelectItem value="new">+ Novo Cliente</SelectItem>
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
          <Label>Origem (CEP)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="00000-000"
              value={data.originCep}
              onChange={(e) => updateData({ originCep: e.target.value })}
              onBlur={(e) => fetchAddress(e.target.value, 'origin')}
              maxLength={9}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchAddress(data.originCep, 'origin')}
              disabled={loadingCepOrigin}
            >
              {loadingCepOrigin ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Input
            value={data.origin}
            onChange={(e) => updateData({ origin: e.target.value })}
            placeholder="Cidade, UF"
            className="bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Destino (CEP)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="00000-000"
              value={data.destinationCep}
              onChange={(e) => updateData({ destinationCep: e.target.value })}
              onBlur={(e) => fetchAddress(e.target.value, 'destination')}
              maxLength={9}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchAddress(data.destinationCep, 'destination')}
              disabled={loadingCepDest}
            >
              {loadingCepDest ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Input
            value={data.destination}
            onChange={(e) => updateData({ destination: e.target.value })}
            placeholder="Cidade, UF"
            className="bg-muted/50"
          />
        </div>
      </div>

      {data.icms > 0 && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100 flex items-center gap-2">
          <span className="font-bold">ICMS:</span>
          <span>
            Alíquota de {data.icms}% aplicada para rota {data.origin} ➔{' '}
            {data.destination}
          </span>
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
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
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
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
