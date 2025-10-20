import { Offer } from '../types/index.js'

export async function generateAutoOffers(
  _cpf: string,
  data: Record<string, unknown>
): Promise<Offer[]> {
  const basePremium = calculateBasePremium(data)
  const hasTracker = data.hasTracker === 'sim'

  const offers: Offer[] = [
    {
      id: 'auto-offer-1',
      insurerName: 'Porto Seguro Auto',
      premium: basePremium * (hasTracker ? 0.85 : 1),
      monthlyPayment: (basePremium * (hasTracker ? 0.85 : 1)) / 12,
      coverages: [
        { name: 'Colisão', value: 50000 },
        { name: 'Roubo e Furto', value: 50000 },
        { name: 'Incêndio', value: 50000 },
        { name: 'Terceiros - Danos Materiais', value: 100000 },
        { name: 'Terceiros - Danos Corporais', value: 100000 },
      ],
      discounts: hasTracker
        ? [{ name: 'Rastreador', percentage: 15 }]
        : undefined,
    },
    {
      id: 'auto-offer-2',
      insurerName: 'Bradesco Auto',
      premium: basePremium * 1.1 * (hasTracker ? 0.9 : 1),
      monthlyPayment: (basePremium * 1.1 * (hasTracker ? 0.9 : 1)) / 12,
      coverages: [
        { name: 'Colisão', value: 60000 },
        { name: 'Roubo e Furto', value: 60000 },
        { name: 'Incêndio', value: 60000 },
        { name: 'Terceiros - Danos Materiais', value: 150000 },
        { name: 'Terceiros - Danos Corporais', value: 150000 },
        { name: 'Vidros', value: 2000 },
      ],
      discounts: hasTracker
        ? [{ name: 'Rastreador', percentage: 10 }]
        : undefined,
    },
    {
      id: 'auto-offer-3',
      insurerName: 'Itaú Auto',
      premium: basePremium * 0.95 * (hasTracker ? 0.88 : 1),
      monthlyPayment: (basePremium * 0.95 * (hasTracker ? 0.88 : 1)) / 12,
      coverages: [
        { name: 'Colisão', value: 55000 },
        { name: 'Roubo e Furto', value: 55000 },
        { name: 'Incêndio', value: 55000 },
        { name: 'Terceiros - Danos Materiais', value: 120000 },
        { name: 'Terceiros - Danos Corporais', value: 120000 },
        { name: 'Assistência 24h', value: 0 },
      ],
      discounts: hasTracker
        ? [{ name: 'Rastreador', percentage: 12 }]
        : undefined,
    },
  ]

  return offers
}

function calculateBasePremium(data: Record<string, unknown>): number {
  let basePremium = 2500

  const currentYear = new Date().getFullYear()
  const vehicleYear = parseInt(data?.year as string) || currentYear
  const vehicleAge = currentYear - vehicleYear

  if (vehicleAge <= 2) {
    basePremium += 800
  } else if (vehicleAge <= 5) {
    basePremium += 400
  } else if (vehicleAge > 10) {
    basePremium -= 300
  }

  const birthDate = parseDate(data.birthDate as string)
  if (birthDate) {
    const age = currentYear - birthDate.getFullYear()
    if (age < 25) {
      basePremium += 600
    } else if (age > 60) {
      basePremium += 300
    }
  }

  const premiumBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes']
  if (premiumBrands.includes(data.brand as string)) {
    basePremium += 500
  }

  return basePremium
}

function parseDate(dateString: string): Date | null {
  if (!dateString) return null
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  return new Date(
    parseInt(parts[2]),
    parseInt(parts[1]) - 1,
    parseInt(parts[0])
  )
}
