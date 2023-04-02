import {ValidationError} from "../types/validation.error"
import {ExchangeRateCurrent} from "../types/exchange-rate-current.type";
import {round} from "./round";

function checkHeaders(lines: string[]) {
  const messages = []

  // Number of lines is critical error and there is no need to continue parsing
  if (lines.length > 2) {
    messages.push('Expected exactly 2 lines')
    throw new ValidationError('Current exchange rate header is invalid', messages)
  }

  // DD MMM YYYY
  const dateRegex = /((?:(?:[0-9])|(?:[0-2][0-9])|(?:3[0-1])) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4})/
  // Issue number
  const issueRegex = /#(\d+)/

  // DD MMM YYYY #123
  const matches = lines[0].match(dateRegex.source + ' ' + issueRegex.source)
  if (!matches) {
    messages.push('Line 1 should contain creation date and issue number')
    throw new ValidationError('Current exchange rate header is invalid', messages)
  }

  // Critical error
  if (matches.length < 3) {
    messages.push('Line 1 should contain creation date and issue number')
    throw new ValidationError('Current exchange rate header is invalid', messages)
  }

  // They publish exchange rates on business days only, so there is the same problem as with the issue number.

  // Issue number should be equal to number of business days since start of the year. However, checking that value would
  // require to have list of all holidays.

  const HEADER = 'Country|Currency|Amount|Code|Rate'
  if (lines[1] !== HEADER) {
    messages.push('Line 2 should contain header')
  }

  if (messages.length !== 0) {
    throw new ValidationError('Current exchange rate header is invalid', messages)
  }

  return true
}

function checkLine(index: number, line: string) {
  if (line.length === 0) {
    throw new ValidationError(`Line ${index} is invalid`, ['Line is empty'])
  }

  const [countryName, currencyName, amount, currencyCode, rate, ...rest] = line.split('|')

  const messages = []

  if (rest.length !== 0) {
    messages.push(`Expected exactly 5 columns, got ${rest.length + 5}: '${line}'`)
    throw new ValidationError(`Line ${index} is invalid`, messages)
  }

  if (countryName.length === 0 || countryName[0].toUpperCase() !== countryName[0]) {
    messages.push(`Country name must be capitalized and non-empty string. Got: '${countryName}'`)
  }

  if (currencyName.length === 0 || (currencyName !== 'SDR' && currencyName.toLowerCase() !== currencyName)) {
    messages.push(`Currency name must be non-empty and lowercase string. Got: '${currencyName}'`)
  }

  const amountAsNumber = parseInt(amount)
  if (amount.length === 0 || (amountAsNumber !== 1 && amountAsNumber % 10 !== 0)) {
    messages.push(`Amount must be non-empty and either 1 or power of 10. Got: '${amountAsNumber}'`)
  }

  if (currencyCode.length !== 3 || currencyCode.toUpperCase() !== currencyCode) {
    messages.push(`Currency code must be 3 characters long capitalized string. Got: '${currencyCode}'`)
  }

  const rateAsNumber = parseFloat(rate)
  if (rate.length === 0 || rateAsNumber < 1) {
    messages.push(`Rate must be non-empty and greater than or equal to 1. Got: '${rateAsNumber}'`)
  }

  if (messages.length !== 0) {
    throw new ValidationError(`Line ${index} is invalid.`, messages)
  }

  return {
    countryName,
    currencyName,
    currencyCode,
    rate: round(rateAsNumber / amountAsNumber, 3 + Math.log10(amountAsNumber))
  }
}

function parseLine(index: number, line: string): ExchangeRateCurrent {
  const content = checkLine(index, line)

  return {
    countryName: content.countryName,
    name: content.currencyName,
    code: content.currencyCode,
    rate: content.rate
  }
}

export function exchangeRateCurrentParse(data: string): ExchangeRateCurrent[] {
  const lines = data.split('\n')

  // In case the file was larger, we could use async workers that would parse the file in chunks.
  // However, in our case, there is no need to over-engineer the solution.

  checkHeaders([lines[0], lines[1]])

  const exchangeRates: ExchangeRateCurrent[] = []

  for(let index = 2; index < lines.length; index++) {
    if (lines[index].length === 0) {
      continue
    }

    exchangeRates.push(
      parseLine(index, lines[index])
    )
  }

  return exchangeRates
}

/// TESTS

if (import.meta.vitest) {
  const { test, describe, expect } = import.meta.vitest

  describe('checkLine', () => {
    test('validation', () => {
      expect(() => checkLine(1, 'a|b|c|d|e|f|g|h')).toThrow()

      // Country code
      expect(() => checkLine(1, '|currency|1|COD|11.1')).toThrow()
      expect(() => checkLine(1, 'country|currency|1|COD|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|11.1')).not.toThrow()

      // Currency name
      expect(() => checkLine(1, 'Country||1|COD|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|CuRrEnYy|1|COD|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|11.1')).not.toThrow()

      // Amount
      expect(() => checkLine(1, 'Country|currency||COD|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|15|COD|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1000|COD|11.1')).not.toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|11.1')).not.toThrow()

      // Currency code
      expect(() => checkLine(1, 'Country|currency|1||11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|cod|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|CoD|11.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|11.1')).not.toThrow()

      // Rate
      expect(() => checkLine(1, 'Country|currency|1|COD|')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|0.1')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|0')).toThrow()
      expect(() => checkLine(1, 'Country|currency|1|COD|11.1')).not.toThrow()
    })

    test('parsing', () => {
      const lines = [
        "Australia|dollar|1|AUD|14.436",
        "Brazil|real|1|BRL|4.259",
        "Hungary|forint|100|HUF|6.189",
        "Indonesia|rupiah|1000|IDR|1.440",
      ]

      const results: ExchangeRateCurrent[] = [
        {
          countryName: 'Australia',
          name: 'dollar',
          code: 'AUD',
          rate: 14.436
        },
        {
          countryName: 'Brazil',
          name: 'real',
          code: 'BRL',
          rate: 4.259
        },
        {
          countryName: 'Hungary',
          name: 'forint',
          code: 'HUF',
          rate: 0.06189
        },
        {
          countryName: 'Indonesia',
          name: 'rupiah',
          code: 'IDR',
          rate: 0.00144
        }
      ]

      for(let index = 0; index < lines.length; index++) {
        expect(parseLine(index, lines[index])).toEqual(results[index])
      }
    })
  })

}
