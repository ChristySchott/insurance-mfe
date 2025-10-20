export interface Coverage {
  name: string
  value: number
}

export interface Discount {
  name: string
  percentage: number
}

export interface Offer {
  id: string
  insurerName: string
  premium: number
  monthlyPayment: number
  coverages: Coverage[]
  discounts?: Discount[]
}

export type ProductType = 'auto' | 'residencial'
