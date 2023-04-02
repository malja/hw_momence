export function round(value: number, decimalPlaces = 0) {
  const power = Math.pow(10, decimalPlaces)
  const n = (value * power) * (1 + Number.EPSILON)
  return Math.round(n) / power
}
