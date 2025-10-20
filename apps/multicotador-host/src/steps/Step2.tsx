import { lazy, Suspense } from 'react'
import { useCotacaoStore } from '../store/cotacaoStore'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const AutoForm = lazy(() => import('productsMfe/AutoForm'))
const ResidencialForm = lazy(() => import('productsMfe/ResidencialForm'))

export function Step2() {
  const { productType } = useCotacaoStore()

  if (!productType) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Por favor, selecione um tipo de seguro na etapa anterior
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Detalhes do{' '}
          {productType === 'auto' ? 'Seguro Auto' : 'Seguro Residência'}
        </h2>
        <p className="text-gray-600">
          Preencha a informação necessária para a sua cotação
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary>
          {productType === 'auto' && <AutoForm />}
          {productType === 'residencial' && <ResidencialForm />}
        </ErrorBoundary>
      </Suspense>
    </div>
  )
}
