export const formatPlate = (value: string) => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^([A-Z]{3})([A-Z0-9])/, '$1-$2')
    .slice(0, 8)
}
