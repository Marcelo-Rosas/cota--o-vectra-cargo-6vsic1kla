import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { QuoteFormData, INITIAL_QUOTE_DATA } from './types'
import { Step1ShipmentData } from './components/wizard/Step1ShipmentData'
import { Step2CalculationParams } from './components/wizard/Step2CalculationParams'
import { Step3ViabilityAnalysis } from './components/wizard/Step3ViabilityAnalysis'
import { Step4Review } from './components/wizard/Step4Review'
import { QuotePreviewSidebar } from './components/wizard/QuotePreviewSidebar'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewQuote() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<QuoteFormData>(INITIAL_QUOTE_DATA)
  const { toast } = useToast()

  const updateData = useCallback((newData: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }, [])

  // Methodology Decision Tree & Freight Calculation Engine
  useEffect(() => {
    const runAnalysisEngine = () => {
      // 1. Calculate Physical Properties
      const cubage = (data.dimLength * data.dimWidth * data.dimHeight) / 1000000 // cm³ to m³
      const cubedWeight = cubage * 300 // Standard factor 300kg/m³
      const weightChargeable = Math.max(data.weight, cubedWeight)

      // 2. Determine Recommended Methodology
      let recommendation: 'lotacao' | 'fracionada' = 'fracionada'

      // Decision Rules
      if (data.urgency === 'expressa') recommendation = 'lotacao'
      else if (weightChargeable > 3000)
        recommendation = 'lotacao' // Weight threshold
      else if (cubage > 15) recommendation = 'lotacao' // Volume threshold

      // 3. Calculate Fracionado Cost
      // Base Tariff: (Weight/100) * (Distance/100) * Factor + Fixed
      // This is a mock formula to simulate NTC table complexity
      const baseTariffFrac =
        (weightChargeable / 100) * (Math.max(data.distance, 50) / 100) * 45 + 80
      const adValorem = data.merchandiseValue * 0.003 // 0.3%
      const gris = data.merchandiseValue * 0.002 // 0.2%
      const deliveryFee = 60 // Fixed tax

      let totalFracionado = baseTariffFrac + adValorem + gris + deliveryFee

      // 4. Calculate Lotacao Cost
      // Vehicle Type Selection based on weight/volume
      let vehicleRate = 3.5 // Small Truck
      if (data.weight > 3000 || cubage > 15) vehicleRate = 4.8 // Medium
      if (data.weight > 8000 || cubage > 30) vehicleRate = 6.5 // Large
      if (data.weight > 14000 || cubage > 50) vehicleRate = 8.5 // Carreta

      // ANTT Floor Validation (Mock check)
      const anttFloorRate = 3.2
      vehicleRate = Math.max(vehicleRate, anttFloorRate)

      let totalLotacao = data.distance * vehicleRate
      // Return Trip Factor
      if (data.distance > 400)
        totalLotacao *= 1.4 // Partial return coverage
      else totalLotacao *= 1.8 // Full return coverage for short trips

      // Urgency Surcharge
      if (data.urgency === 'expressa') {
        totalFracionado *= 1.5
        totalLotacao *= 1.2
      }

      // 5. Estimate Delivery Times (Mock)
      const speedFrac = 400 // km/day
      const speedLot = 700 // km/day
      const timeFrac = Math.ceil(data.distance / speedFrac) + 2 // +2 days for consolidation
      const timeLot = Math.ceil(data.distance / speedLot)

      // Update State with Analysis Results
      // Note: We avoid setting state if values haven't changed significantly to prevent loops
      // But here we rely on React's state batching and the dependency array

      // Determine base freight based on current selection
      let selectedBaseFreight = data.baseFreight
      if (data.useNtcTable) {
        selectedBaseFreight =
          data.methodology === 'lotacao' ? totalLotacao : totalFracionado
      }

      // --- Financial Viability Calculation ---
      const operationalCosts =
        data.loadingCost + data.equipmentCost + data.tollCost

      let revenue = 0
      if (data.applyMarkup) {
        let costBase = selectedBaseFreight
        if (data.applyTaxesOnCosts) {
          costBase += operationalCosts
        }
        revenue = costBase * (1 + data.markupPercentage / 100)
      } else {
        revenue = data.negotiatedFreight
      }

      const taxRate = 0.1625
      const taxesOnRevenue = revenue * taxRate

      const totalCosts = selectedBaseFreight + operationalCosts + taxesOnRevenue
      const marginValue = revenue - totalCosts
      const marginPercent = revenue > 0 ? (marginValue / revenue) * 100 : 0

      let classification: 'Excelente' | 'Viável' | 'Recusar' = 'Viável'
      if (marginPercent >= 25) classification = 'Excelente'
      if (marginPercent < 10) classification = 'Recusar'

      setData((prev) => {
        // Only update if derived values differ to avoid render loops (simple check)
        if (
          prev.cubage === cubage &&
          prev.cubedWeight === cubedWeight &&
          prev.costFracionado === totalFracionado &&
          prev.calculatedRevenue === revenue
        )
          return prev

        return {
          ...prev,
          cubage,
          cubedWeight,
          recommendedMethodology: recommendation,
          costFracionado: totalFracionado,
          costLotacao: totalLotacao,
          timeFracionado: timeFrac,
          timeLotacao: timeLot,
          baseFreight: selectedBaseFreight,
          calculatedRevenue: revenue,
          totalCosts,
          grossMargin: marginPercent,
          grossMarginValue: marginValue,
          classification,
          taxCost: taxesOnRevenue,
          operationalCostTotal: operationalCosts,
        }
      })
    }

    runAnalysisEngine()
  }, [
    data.dimLength,
    data.dimWidth,
    data.dimHeight,
    data.weight,
    data.distance,
    data.merchandiseValue,
    data.urgency,
    data.loadingCost,
    data.equipmentCost,
    data.tollCost,
    data.applyTaxesOnCosts,
    data.applyMarkup,
    data.markupPercentage,
    data.negotiatedFreight,
    data.methodology,
    data.useNtcTable,
    data.baseFreight,
  ])

  const nextStep = () => {
    if (step === 1) {
      if (!data.client || !data.origin || !data.destination) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Preencha Cliente, Origem e Destino para continuar.',
          variant: 'destructive',
        })
        return
      }
      if (data.distance <= 0) {
        toast({
          title: 'Distância necessária',
          description: 'Informe a distância ou calcule via CEP.',
          variant: 'destructive',
        })
        return
      }
    }
    if (step === 2) {
      if (!data.applyMarkup && !data.negotiatedFreight) {
        toast({
          title: 'Atenção',
          description:
            'Quando o Markup está desativado, é obrigatório informar o Frete Negociado.',
          variant: 'destructive',
        })
        return
      }
    }
    setStep((s) => Math.min(s + 1, 4))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-primary">
                  Nova Cotação de Frete
                </CardTitle>
                <CardDescription>
                  Passo {step} de 4 -{' '}
                  {step === 1
                    ? 'Dados do Embarque'
                    : step === 2
                      ? 'Parâmetros de Cálculo'
                      : step === 3
                        ? 'Análise de Viabilidade'
                        : 'Revisão e Aprovação'}
                </CardDescription>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {Math.round(step * 25)}% Concluído
              </div>
            </div>
            <Progress value={step * 25} className="mt-2 h-2" />
          </CardHeader>
          <CardContent className="min-h-[400px] py-6">
            {step === 1 && (
              <Step1ShipmentData data={data} updateData={updateData} />
            )}
            {step === 2 && (
              <Step2CalculationParams data={data} updateData={updateData} />
            )}
            {step === 3 && <Step3ViabilityAnalysis data={data} />}
            {step === 4 && <Step4Review data={data} />}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6 bg-muted/10">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="w-32"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <div className="flex gap-2">
              {step === 4 && (
                <Button variant="outline" className="w-32">
                  <Save className="mr-2 h-4 w-4" /> Rascunho
                </Button>
              )}
              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  className="w-32 bg-primary hover:bg-primary/90"
                >
                  Próximo <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 w-32 text-white">
                  Finalizar
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <QuotePreviewSidebar data={data} />
      </div>
    </div>
  )
}
