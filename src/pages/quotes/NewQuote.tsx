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
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewQuote() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<QuoteFormData>(INITIAL_QUOTE_DATA)
  const { toast } = useToast()

  const updateData = (newData: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  // Calculation Logic based on User Story
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
        merchandiseValue,
      } = data

      // Operational Costs (Sum of costs)
      const operationalCosts = loadingCost + equipmentCost + tollCost

      let revenue = 0 // AV2

      // Logic for AV2 (Frete_R$)
      if (applyMarkup) {
        // If Markup = YES
        // AV2 = IFERROR(AO2,0) + IF(T2="Sim",SUM(Costs),0) -> Then apply markup
        // Here AO2 is Base Freight (Frete Caminhão)
        let costBase = baseFreight

        if (applyTaxesOnCosts) {
          costBase += operationalCosts
        }

        // Apply Markup
        revenue = costBase * (1 + markupPercentage / 100)
      } else {
        // If Markup = NO
        // AV2 = IFERROR(AO2,0) -> Negotiated Freight
        revenue = negotiatedFreight
      }

      // Tax Calculation (Mock logic: ICMS + PIS/COFINS + GRIS + Ad Valorem)
      // Assuming ~18% total tax burden on revenue + Ad Valorem on Merchandise Value
      const taxRate = 0.1625 // 16.25% average tax
      const adValoremRate = 0.003 // 0.3%

      const taxesOnRevenue = revenue * taxRate
      const adValoremTax = merchandiseValue * adValoremRate
      const totalTaxes = taxesOnRevenue + adValoremTax

      // Logic for BB2 (Margem Bruta)
      // BB2 = AV2 - (Operational Costs + Taxes + Base Freight)
      // Ensure costs are subtracted only once

      const totalDirectCosts = baseFreight + operationalCosts
      const totalCosts = totalDirectCosts + totalTaxes

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
        taxCost: totalTaxes,
        operationalCostTotal: operationalCosts,
      }))
    }

    calculateQuote()
  }, [
    data.baseFreight,
    data.loadingCost,
    data.equipmentCost,
    data.tollCost,
    data.applyTaxesOnCosts,
    data.applyMarkup,
    data.markupPercentage,
    data.negotiatedFreight,
    data.merchandiseValue,
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
