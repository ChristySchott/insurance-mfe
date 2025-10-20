import { Offer } from '../types/index.js'

export async function generateResidencialOffers(
  _cpf: string,
  data: Record<string, unknown>
): Promise<Offer[]> {
  const basePremium = calculateBasePremium(data)
  const hasAlarm = data.hasAlarm === 'sim'

  const offers: Offer[] = [
    {
      id: 'residencial-offer-1',
      insurerName: 'Porto Seguro Residência',
      premium: basePremium * (hasAlarm ? 0.85 : 1),
      monthlyPayment: (basePremium * (hasAlarm ? 0.85 : 1)) / 12,
      coverages: [
        { name: 'Incêndio', value: 300000 },
        { name: 'Danos Elétricos', value: 15000 },
        { name: 'RC Familiar', value: 50000 },
        { name: 'Roubo de Bens', value: 20000 },
      ],
      discounts: hasAlarm
        ? [{ name: 'Alarme Monitorado', percentage: 15 }]
        : undefined,
    },
    {
      id: 'residencial-offer-2',
      insurerName: 'Bradesco Residência',
      premium: basePremium * 1.15 * (hasAlarm ? 0.9 : 1),
      monthlyPayment: (basePremium * 1.15 * (hasAlarm ? 0.9 : 1)) / 12,
      coverages: [
        { name: 'Incêndio', value: 350000 },
        { name: 'Danos Elétricos', value: 20000 },
        { name: 'RC Familiar', value: 80000 },
        { name: 'Roubo de Bens', value: 30000 },
        { name: 'Vendaval', value: 50000 },
        { name: 'Assistência Residencial', value: 0 },
      ],
      discounts: hasAlarm
        ? [{ name: 'Alarme Monitorado', percentage: 10 }]
        : undefined,
    },
    {
      id: 'residencial-offer-3',
      insurerName: 'Itaú Residência',
      premium: basePremium * 0.92 * (hasAlarm ? 0.87 : 1),
      monthlyPayment: (basePremium * 0.92 * (hasAlarm ? 0.87 : 1)) / 12,
      coverages: [
        { name: 'Incêndio', value: 320000 },
        { name: 'Danos Elétricos', value: 18000 },
        { name: 'RC Familiar', value: 60000 },
        { name: 'Roubo de Bens', value: 25000 },
        { name: 'Quebra de Vidros', value: 5000 },
      ],
      discounts: hasAlarm
        ? [{ name: 'Alarme Monitorado', percentage: 13 }]
        : undefined,
    },
  ]

  return offers
}

function calculateBasePremium(data: Record<string, unknown>): number {
  let basePremium = 800

  const totalArea = parseFloat((data.totalArea as string) || '0')

  if (totalArea > 200) {
    basePremium += 600
  } else if (totalArea > 100) {
    basePremium += 300
  } else if (totalArea < 50) {
    basePremium -= 100
  }

  if (data.propertyType === 'casa') {
    basePremium += 200
  }

  const postalCode = (data.postalCode as string)?.replace(/\D/g, '') || ''
  const postalCodePrefix = postalCode.substring(0, 5)
  const premiumAreas = ['01310', '01311', '04551', '05411']

  if (premiumAreas.includes(postalCodePrefix)) {
    basePremium += 400
  }

  return basePremium
}
