import {exchangeRateCurrentParse} from "../helpers/exchange-rate-current-parse";
import {useQuery} from "react-query";
import dayjs, {Dayjs} from "dayjs";

async function fetchCurrentExchangeRate() {
  const response = await fetch(import.meta.env.VITE_EXCHANGE_RATE_API_CURRENT_URL)

  if (!response.ok) {
    throw new Error(`Could not load exchange rate ${response.status} ${response.statusText}`)
  }

  const text = await response.text()

  return exchangeRateCurrentParse(text)
}

export function useCurrentExchangeRate() {
  const isBefore2_30pm = dayjs().hour() < 14 && dayjs().minute() < 30
  const isWeekend = dayjs().day() === 6 || dayjs().day() === 0

  let daysToAdd: number

  if (isWeekend) {
    const daysToMonday = dayjs().day() === 6 ? 2 : 1
    daysToAdd = daysToMonday
  } else if (isBefore2_30pm) {
    daysToAdd = 0
  } else {
    daysToAdd = 1
  }

  const newVersionReleasedAt = dayjs().startOf('day').add(daysToAdd, 'days').add(14, 'hours').add(30, 'minutes')
  const validForMs = newVersionReleasedAt.diff(dayjs(), 'ms')

  return useQuery('exchangeRatesCurrent', fetchCurrentExchangeRate, { staleTime: validForMs, cacheTime: validForMs })
}
