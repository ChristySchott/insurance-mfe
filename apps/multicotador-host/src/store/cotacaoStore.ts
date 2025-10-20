import { create } from 'zustand'
import { Offer, ProductType } from './types'

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

  offers: Offer[]
  selectedOffer: Offer | null
  step3IsValid: boolean
  setOffers: (offers: Offer[]) => void
  setSelectedOffer: (offer: Offer) => void

  reset: () => void
}

const initialState = {
  currentStep: 1,
  cpf: '',
  productType: null,
  step2Data: {},
  step2IsValid: false,
  offers: [],
  selectedOffer: null,
  step3IsValid: false,
}

export const useCotacaoStore = create<CotacaoStore>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  setCpf: (cpf) => set({ cpf }),

  setProductType: (type) => set({ productType: type }),

  setStep2Data: (data) => set({ step2Data: data }),

  setStep2IsValid: (valid) => set({ step2IsValid: valid }),

  setOffers: (offers) => set({ offers }),

  setSelectedOffer: (offer) =>
    set({ selectedOffer: offer, step3IsValid: true }),

  reset: () => set(initialState),
}))

export type { Offer, ProductType } from './types'
