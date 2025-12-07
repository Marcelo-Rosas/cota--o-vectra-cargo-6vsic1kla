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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  CalendarIcon,
  Search,
  Loader2,
  Box,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { QuoteFormData } from '../../types'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

  // Mock ICMS and Distance calculation
  useEffect(() => {
    if (data.origin && data.destination) {
      const originState = data.origin.split(', ')[1]
      const destState = data.destination.split(', ')[1]

      const newIcms = originState === destState ? 18 : 12

      // Mock distance generation based on states if not set
      let mockDistance = data.distance
      if (mockDistance === 0) {
        if (originState === destState) mockDistance = 150
        else mockDistance = 850
        updateData({ distance: mockDistance })
      }

      if (newIcms !== data.icms) {
        updateData({ icms: newIcms })
      }
    }
  }, [data.origin, data.destination, data.distance, data.icms, updateData])

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Distância (km)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              className="pl-9"
              placeholder="0"
              value={data.distance || ''}
              onChange={(e) => updateData({ distance: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Urgência do Embarque</Label>
          <Select
            value={data.urgency}
            onValueChange={(val: any) => updateData({ urgency: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal - Menor Custo</SelectItem>
              <SelectItem value="alta">Alta - Prioridade</SelectItem>
              <SelectItem value="expressa">
                Expressa - Veículo Dedicado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {data.icms > 0 && (
        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle>Informação Fiscal</AlertTitle>
          <AlertDescription>
            Alíquota de ICMS calculada automaticamente:{' '}
            <strong>{data.icms}%</strong> para o trecho.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2 mb-2">
          <Box className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Dimensões e Cubagem</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Comprimento (cm)</Label>
            <Input
              type="number"
              value={data.dimLength || ''}
              onChange={(e) =>
                updateData({ dimLength: Number(e.target.value) })
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Largura (cm)</Label>
            <Input
              type="number"
              value={data.dimWidth || ''}
              onChange={(e) => updateData({ dimWidth: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label>Altura (cm)</Label>
            <Input
              type="number"
              value={data.dimHeight || ''}
              onChange={(e) =>
                updateData({ dimHeight: Number(e.target.value) })
              }
              placeholder="0"
            />
          </div>
        </div>
        {data.cubage > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
            <div className="bg-background p-2 rounded border">
              <span className="text-muted-foreground">Cubagem:</span>
              <span className="font-bold ml-2">
                {data.cubage.toFixed(3)} m³
              </span>
            </div>
            <div className="bg-background p-2 rounded border">
              <span className="text-muted-foreground">Peso Cubado:</span>
              <span className="font-bold ml-2">
                {data.cubedWeight.toFixed(1)} kg
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Peso Real (kg)</Label>
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
          <Label>Volumes (Qtd)</Label>
          <Input
            type="number"
            placeholder="0"
            value={data.items || ''}
            onChange={(e) => updateData({ items: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  )
}
