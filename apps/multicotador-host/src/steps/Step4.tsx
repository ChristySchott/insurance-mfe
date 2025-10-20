import { useCotacaoStore } from '../store/cotacaoStore'

export function Step4() {
  const { cpf, productType, step2Data, selectedOffer, reset } =
    useCotacaoStore()

  const handleFinish = () => {
    alert('Cotação finalizada com sucesso!')
    reset()
  }

  if (!selectedOffer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhuma oferta selecionada</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Resumo da cotação
        </h2>
        <p className="text-gray-600">Revise os detalhes da sua cotação</p>
      </div>

      <div className="space-y-6">
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informação pessoal
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">CPF</p>
              <p className="font-medium text-gray-900">{cpf}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo do seguro</p>
              <p className="font-medium text-gray-900 capitalize">
                {productType === 'auto' ? 'Seguro Auto' : 'Seguro Residencial'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalhes da cotação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(step2Data).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-medium text-gray-900">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Oferta selecionada
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {selectedOffer.insurerName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-green-200">
              <div>
                <p className="text-sm text-gray-600">Prêmio total</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {selectedOffer.premium.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pagamento mensal</p>
                <p className="text-lg font-semibold text-gray-900">
                  12x R$ {selectedOffer.monthlyPayment.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Coberturas
              </p>
              <ul className="space-y-2">
                {selectedOffer.coverages.map((coverage) => (
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

            {selectedOffer.discounts && selectedOffer.discounts.length > 0 && (
              <div className="pt-4 border-t border-green-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Descontos aplicados
                </p>
                {selectedOffer.discounts.map((discount) => (
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
                    {discount.percentage}% em {discount.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={handleFinish}
          className="btn-primary px-12 py-3 text-lg"
        >
          Finalizar cotação
        </button>
      </div>
    </div>
  )
}
