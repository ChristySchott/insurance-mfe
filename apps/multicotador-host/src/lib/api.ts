const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export interface QuoteRequest {
  cpf: string
  data: Record<string, unknown>
}

export interface QuoteResponse {
  offers: Array<{
    id: string
    insurerName: string
    premium: number
    monthlyPayment: number
    coverages: Array<{ name: string; value: number }>
    discounts?: Array<{ name: string; percentage: number }>
  }>
}

export async function fetchQuotes(
  productType: string,
  payload: QuoteRequest
): Promise<QuoteResponse> {
  const response = await fetch(`${API_URL}/api/quotes/${productType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch quotes')
  }

  return response.json()
}
