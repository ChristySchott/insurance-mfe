import { z } from 'zod'

export const residencialFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  phone: z
    .string()
    .min(14, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (11) 98765-4321'),
  birthDate: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato: DD/MM/AAAA'),
  postalCode: z
    .string()
    .min(9, 'CEP inválido')
    .regex(/^\d{5}-\d{3}$/, 'Formato: 01310-100'),
  propertyType: z.enum(['casa', 'apartamento'], {
    invalid_type_error: 'Por favor, selecione um tipo de imóvel válido',
    required_error: 'Selecione o tipo de imóvel',
  }),
  totalArea: z
    .string()
    .min(1, 'Área total é obrigatória')
    .refine((val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0 && num <= 10000
    }, 'Área deve estar entre 1 e 10.000 m²'),
  hasAlarm: z.enum(['sim', 'nao'], {
    invalid_type_error: 'Por favor, selecione uma opção válida',
    required_error: 'Selecione uma opção',
  }),
})

export type ResidencialFormData = z.infer<typeof residencialFormSchema>
