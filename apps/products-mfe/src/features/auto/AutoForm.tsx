import { autoFormSchema, AutoFormData } from './lib/validation'
import { FormField } from '@/shared/components/FormField'
import { formatDate, formatPhone } from '@/shared/lib/format'
import { useProductForm } from '@/shared/hooks/useProductForm'
import { ProductFormWrapper } from '@/shared/components/ProductFormWrapper'
import { BRANDS, MODELS_BY_BRANCH } from './lib/data'
import { formatPlate } from './lib/format'

export default function AutoForm() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useProductForm<AutoFormData>({
    schema: autoFormSchema,
  })

  const watchedBrand = watch('brand')
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

      <FormField
        label="CNH"
        name="cnh"
        placeholder="12345678901"
        register={register}
        error={errors.cnh}
        maxLength={11}
      />

      <div>
        <label htmlFor="plate" className="label">
          Placa do Veículo
        </label>
        <input
          id="plate"
          type="text"
          placeholder="ABC-1234"
          maxLength={8}
          className={`input-field ${errors.plate ? 'input-error' : ''}`}
          {...register('plate', {
            onChange: (e) => {
              const formatted = formatPlate(e.target.value)
              setValue('plate', formatted)
            },
          })}
        />
        {errors.plate && (
          <p className="error-message">{errors.plate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="brand" className="label">
          Marca
        </label>
        <select
          id="brand"
          className={`input-field ${errors.brand ? 'input-error' : ''}`}
          {...register('brand', {
            onChange: () => {
              setValue('model', '')
            },
          })}
        >
          <option value="">Selecione a marca</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
        {errors.brand && (
          <p className="error-message">{errors.brand.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="model" className="label">
          Modelo
        </label>
        <select
          id="model"
          disabled={!watchedBrand}
          className={`input-field ${errors.model ? 'input-error' : ''}`}
          {...register('model')}
        >
          <option value="">
            {watchedBrand ? 'Selecione o modelo' : 'Selecione a marca primeiro'}
          </option>
          {watchedBrand &&
            MODELS_BY_BRANCH[watchedBrand]?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>
        {errors.model && (
          <p className="error-message">{errors.model.message}</p>
        )}
      </div>

      <FormField
        label="Ano"
        name="year"
        placeholder="2023"
        register={register}
        error={errors.year}
        maxLength={4}
      />

      <div>
        <label className="label">Possui Rastreador?</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="sim"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasTracker')}
            />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="nao"
              className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500"
              {...register('hasTracker')}
            />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
        {errors.hasTracker && (
          <p className="error-message">{errors.hasTracker.message}</p>
        )}
      </div>
    </ProductFormWrapper>
  )
}
