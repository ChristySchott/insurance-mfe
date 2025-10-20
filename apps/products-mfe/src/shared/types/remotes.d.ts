declare module 'multicotadorHost/store' {
  import { ProductType } from './store-types'

  export interface CotacaoStore {
    currentStep: number
    setCurrentStep: (step: number) => void
    cpf: string
    productType: ProductType | null
    setCpf: (cpf: string) => void
    setProductType: (type: ProductType) => void
    step2Data: Record<string, unknown>
    step2IsValid: boolean
    setStep2Data: (data: Record<string, unknown>) => void
    setStep2IsValid: (valid: boolean) => void
    offers: unknown[]
    selectedOffer: unknown | null
    step3IsValid: boolean
    setOffers: (offers: unknown[]) => void
    setSelectedOffer: (offer: unknown) => void
    reset: () => void
  }

  export type ProductType = 'auto' | 'residencial'

  export function useCotacaoStore(): CotacaoStore
}
