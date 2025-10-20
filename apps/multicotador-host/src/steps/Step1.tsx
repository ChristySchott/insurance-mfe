import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCotacaoStore, ProductType } from '../store/cotacaoStore'
import { formatCpf } from '@/lib/format'

const step1Schema = z.object({
  cpf: z
    .string()
    .min(11, 'CPF deve ter pelo menos 11 caracteres')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF com formato inválido'),
  productType: z.enum(['auto', 'residencial'], {
    invalid_type_error: 'Por favor, selecione um tipo válido de seguro',
    required_error: 'Por favor, selecione um tipo de seguro',
  }),
})

type Step1FormData = z.infer<typeof step1Schema>

export function Step1() {
  const { cpf, productType, setCpf, setProductType } = useCotacaoStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      cpf,
      productType: productType || undefined,
    },
  })

  const productTypeValue = watch('productType')

  const onSubmit = (data: Step1FormData) => {
    setCpf(data.cpf)
    setProductType(data.productType)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Inicie a cotação
        </h2>
        <p className="text-gray-600">
          Preencha as suas informações para seguir com a cotação
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="cpf" className="label">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            maxLength={14}
            className={`input-field ${errors.cpf ? 'input-error' : ''}`}
            {...register('cpf', {
              onChange: (e) => {
                const formatted = formatCpf(e.target.value)
                setValue('cpf', formatted)
                setCpf(formatted)
              },
            })}
          />
          {errors.cpf && <p className="error-message">{errors.cpf.message}</p>}
        </div>

        <div>
          <label className="label">Tipo do seguro</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`
                relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${
                  productTypeValue === 'auto'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                value="auto"
                className="sr-only"
                {...register('productType', {
                  onChange: (e) =>
                    setProductType(e.target.value as ProductType),
                })}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Seguro Auto
                  </span>

                  {productTypeValue === 'auto' && (
                    <svg
                      className="w-6 h-6 text-primary-600"
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
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Proteja seu veículo
                </p>
              </div>
            </label>

            <label
              className={`
                relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${
                  productTypeValue === 'residencial'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                value="residencial"
                className="sr-only"
                {...register('productType', {
                  onChange: (e) =>
                    setProductType(e.target.value as ProductType),
                })}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Seguro Residencial
                  </span>
                  {productTypeValue === 'residencial' && (
                    <svg
                      className="w-6 h-6 text-primary-600"
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
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Proteja a sua residência
                </p>
              </div>
            </label>
          </div>
          {errors.productType && (
            <p className="error-message mt-2">{errors.productType.message}</p>
          )}
        </div>
      </form>
    </div>
  )
}
