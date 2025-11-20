import { useState, useEffect } from 'react'
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
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function NewQuote() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<QuoteFormData>(INITIAL_QUOTE_DATA)

  const updateData = (newData: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  // Calculation Logic
  useEffect(() => {
    const calculateQuote = () => {
      const {
        baseFreight,
        loadingCost,
        equipmentCost,
        tollCost,
        applyTaxesOnCosts,
        applyMarkup,
        markupPercentage,
        negotiatedFreight,
      } = data

      const operationalCosts = loadingCost + equipmentCost + tollCost
      let revenue = 0

      // Logic based on User Story:
      // If Markup = YES: AV2 = AO2 + IF(T2="Sim", Sum(Costs), 0)
      // Here AO2 is interpreted as Base Freight adjusted by Markup
      // But standard logic implies:
      // Base Revenue = Base Freight
      // If Apply Taxes on Costs -> Add Costs to Base Revenue
      // Apply Markup to Base Revenue

      if (applyMarkup) {
        let costBase = baseFreight
        if (applyTaxesOnCosts) {
          costBase += operationalCosts
        }
        // Applying markup
        revenue = costBase * (1 + markupPercentage / 100)
      } else {
        // If Markup = NO: Use Negotiated Freight
        revenue = negotiatedFreight
      }

      // Total Costs for Margin Calculation
      // Costs should not be duplicated.
      // Total Costs = Base Freight Cost (assumed same as baseFreight for simplicity or 80% of it) + Operational Costs + Taxes
      // Let's assume Base Freight *is* a cost (payment to driver/partner)
      const taxRate = 0.18 // Mock tax rate
      const taxes = revenue * taxRate
      const totalCosts = baseFreight + operationalCosts + taxes

      const marginValue = revenue - totalCosts
      const marginPercent = revenue > 0 ? (marginValue / revenue) * 100 : 0

      let classification: 'Excelente' | 'Viável' | 'Recusar' = 'Viável'
      if (marginPercent >= 25) classification = 'Excelente'
      if (marginPercent < 10) classification = 'Recusar'

      setData((prev) => ({
        ...prev,
        calculatedRevenue: revenue,
        totalCosts: totalCosts,
        grossMargin: marginPercent,
        grossMarginValue: marginValue,
        classification: classification,
      }))
    }

    calculateQuote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data.baseFreight,
    data.loadingCost,
    data.equipmentCost,
    data.tollCost,
    data.applyTaxesOnCosts,
    data.applyMarkup,
    data.markupPercentage,
    data.negotiatedFreight,
  ])

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Cotação de Frete</CardTitle>
            <CardDescription>
              Passo {step} de 4 - Preencha os dados para calcular.
            </CardDescription>
            <Progress value={step * 25} className="mt-2" />
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {step === 1 && (
              <Step1ShipmentData data={data} updateData={updateData} />
            )}
            {step === 2 && (
              <Step2CalculationParams data={data} updateData={updateData} />
            )}
            {step === 3 && <Step3ViabilityAnalysis data={data} />}
            {step === 4 && <Step4Review data={data} />}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="w-32"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            {step < 4 ? (
              <Button onClick={nextStep} className="w-32">
                Próximo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700 w-32">
                Finalizar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <QuotePreviewSidebar data={data} />
      </div>
    </div>
  )
}
