export const formatPostalCode = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  return numbers.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)
}
