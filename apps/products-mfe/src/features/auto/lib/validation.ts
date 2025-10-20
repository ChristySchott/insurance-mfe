import { z } from 'zod'

export const autoFormSchema = z.object({
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
  cnh: z
    .string()
    .min(11, 'CNH deve ter 11 dígitos')
    .max(11, 'CNH deve ter 11 dígitos')
    .regex(/^\d{11}$/, 'CNH deve conter apenas números'),
  plate: z
    .string()
    .min(7, 'Placa inválida')
    .max(8, 'Placa inválida')
    .regex(/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/, 'Formato: ABC-1234 ou ABC1D34'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z
    .string()
    .min(4, 'Ano inválido')
    .max(4, 'Ano inválido')
    .regex(/^\d{4}$/, 'Ano deve ter 4 dígitos')
    .refine((val) => {
      const year = parseInt(val)
      const currentYear = new Date().getFullYear()
      return year >= 1900 && year <= currentYear + 1
    }, 'Ano inválido'),
  hasTracker: z.enum(['sim', 'nao'], {
    invalid_type_error: 'Por favor, selecione uma opção válida',
    required_error: 'Selecione uma opção',
  }),
})

export type AutoFormData = z.infer<typeof autoFormSchema>
