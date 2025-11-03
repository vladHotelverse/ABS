export const formatBookingDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export const passthroughDate = (value: string) => value

export const createTranslator =
  <T extends Record<string, string>>(translations: T) =>
  (key: string) =>
    translations[key] ?? key
