import { useProductForm } from '@/shared/hooks/useProductForm'
import { ProductFormWrapper } from '@/shared/components/ProductFormWrapper'
import { residencialFormSchema, ResidencialFormData } from './lib/validation'
import { FormField } from '@/shared/components/FormField'
import { formatDate, formatPhone } from '@/shared/lib/format'
import { formatPostalCode } from './lib/format'

export default function ResidencialForm() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useProductForm<ResidencialFormData>({
    schema: residencialFormSchema,
  })

  const hasErrors = Object.keys(errors).length > 0

  return (
    <ProductFormWrapper hasErrors={hasErrors}>
      <FormField
        label="Nome Completo"
        name="fullName"
        placeholder="João Silva"
        register={register}
        error={errors.fullName}
        maxLength={100}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="joao@email.com"
        register={register}
        error={errors.email}
      />

      <div>
        <label htmlFor="phone" className="label">
          Telefone
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="(11) 98765-4321"
          maxLength={15}
          className={`input-field ${errors.phone ? 'input-error' : ''}`}
          {...register('phone', {
            onChange: (e) => {
              const formatted = formatPhone(e.target.value)
              setValue('phone', formatted)
            },
          })}
        />
        {errors.phone && (
          <p className="error-message">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="birthDate" className="label">
          Data de Nascimento
        </label>
        <input
          id="birthDate"
          type="text"
          placeholder="01/01/1990"
          maxLength={10}
          className={`input-field ${errors.birthDate ? 'input-error' : ''}`}
          {...register('birthDate', {
            onChange: (e) => {
              const formatted = formatDate(e.target.value)
              setValue('birthDate', formatted)
            },
          })}
        />
        {errors.birthDate && (
          <p className="error-message">{errors.birthDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="postalCode" className="label">
          CEP
        </label>
        <input
          id="postalCode"
          type="text"
          placeholder="01310-100"
          maxLength={9}
          className={`input-field ${errors.postalCode ? 'input-error' : ''}`}
          {...register('postalCode', {
            onChange: (e) => {
              const formatted = formatPostalCode(e.target.value)
              setValue('postalCode', formatted)
            },
          })}
        />
        {errors.postalCode && (
          <p className="error-message">{errors.postalCode.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="propertyType" className="label">
          Tipo de Imóvel
        </label>
        <select
          id="propertyType"
          className={`input-field ${errors.propertyType ? 'input-error' : ''}`}
          {...register('propertyType')}
        >
          <option value="">Selecione o tipo</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
        </select>
        {errors.propertyType && (
          <p className="error-message">{errors.propertyType.message}</p>
        )}
      </div>

      <FormField
        label="Área Total (m²)"
        name="totalArea"
        placeholder="80"
        register={register}
        error={errors.totalArea}
      />

      <div>
        <label className="label">Possui Alarme?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="sim"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasAlarm')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="nao"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasAlarm')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.hasAlarm && (
          <p className="error-message">{errors.hasAlarm.message}</p>
        )}
      </div>
    </ProductFormWrapper>
  )
}
