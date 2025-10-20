import { useEffect, useState } from 'react'
import { useCotacaoStore } from '../store/cotacaoStore'
import { OfferCard } from '../components/OfferCard'
import { fetchQuotes } from '../lib/api'
import { LoadingSpinner } from '../components/LoadingSpinner'

const ErrorComponent = ({ error }: { error: string }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
      <svg
        className="w-8 h-8 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
    <p className="text-gray-900 font-semibold mb-2">{error}</p>
    <button
      onClick={() => window.location.reload()}
      className="btn-primary mt-4"
    >
      Tente novamente
    </button>
  </div>
)

export function Step3() {
  const {
    cpf,
    productType,
    step2Data,
    offers,
    selectedOffer,
    setOffers,
    setSelectedOffer,
  } = useCotacaoStore()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOffers = async () => {
      if (!productType) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetchQuotes(productType, {
          cpf,
          data: step2Data,
        })

        setOffers(response.offers)
      } catch (err) {
        setError('Failed to load offers. Please try again.')
        console.error('Error fetching offers:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadOffers()
  }, [step2Data, productType])

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
        <p className="text-center text-gray-600 mt-4">
          Procurando as melhores ofertas para você...
        </p>
      </div>
    )
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhuma oferta disponível no momento</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ofertas disponíveis
        </h2>
        <p className="text-gray-600">
          Selecione a melhor oferta para o seu Seguro{' '}
          {productType === 'auto' ? 'Auto' : 'Residencial'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isSelected={selectedOffer?.id === offer.id}
            onSelect={() => setSelectedOffer(offer)}
          />
        ))}
      </div>
    </div>
  )
}
