import { Offer } from '../store/types'

interface OfferCardProps {
  offer: Offer
  isSelected: boolean
  onSelect: () => void
}

export function OfferCard({ offer, isSelected, onSelect }: OfferCardProps) {
  const hasDiscount = offer.discounts && offer.discounts.length > 0

  return (
    <div
      onClick={onSelect}
      className={`
        card cursor-pointer transition-all duration-200 relative
        ${isSelected ? 'ring-2 ring-primary-600 shadow-lg' : 'hover:shadow-md'}
      `}
    >
      <div className="absolute top-4 right-4">
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${
              isSelected
                ? 'border-primary-600 bg-primary-600'
                : 'border-gray-300 bg-white'
            }
          `}
        >
          {isSelected && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{offer.insurerName}</h3>
        {hasDiscount && (
          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            {offer.discounts![0].percentage}% de desconto
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Prêmio</p>
          <p className="text-2xl font-bold text-gray-900">
            R$ {offer.premium.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Mensal</p>
          <p className="text-lg font-semibold text-gray-900">Até 12x</p>
          <p className="text-sm text-gray-600">
            R$ {offer.monthlyPayment.toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Coberturas</h4>
        <ul className="space-y-2">
          {offer.coverages.map((coverage) => (
            <li
              key={coverage.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{coverage.name}</span>
              <span className="font-medium text-gray-900">
                R$ {coverage.value.toLocaleString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {hasDiscount && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {offer.discounts!.map((discount) => (
            <div
              key={discount.name}
              className="flex items-center text-sm text-green-700"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {discount.percentage}% de desconto em {discount.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
