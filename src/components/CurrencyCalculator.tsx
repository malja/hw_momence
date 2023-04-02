import {CurrencySelect} from "./ui/CurrencySelect";
import {useCurrentExchangeRate} from "../services/exchange-rate.service";
import {CurrencyFormatter} from "../helpers/currency-formatter.helper";
import {useState} from "react";
import {Output} from "./base/Output";
import {Label} from "./base/Label";
import {Input} from "./base/Input";
import {AILoading} from "./ui/AILoading";
import {CurrencyOutput} from "./ui/CurrencyOutput";

function limitAmount(value: string) {
  const asNumber = parseInt(value)
  if (isNaN(asNumber) || asNumber < 0) {
    return 1000
  }

  return asNumber
}
export function CurrencyCalculator() {
  const { status, data, error } = useCurrentExchangeRate()

  const [amount, setAmount] = useState(1000)
  const [currency, setCurrency] = useState('AUD')

  const convertedAmount = (currency: string) => {
    if (status !== 'success' || !data) {
      return 0
    }

    const targetCurrency = data.find(c => c.code === currency)
    if (!targetCurrency) {
      return 0
    }

    return amount * targetCurrency.rate
  }

  return (
    <>
      <form>
        <Label htmlFor="amount">Amount (CZK):</Label>
        <Input type="number" id="amount" name="amount" onChange={event => setAmount(limitAmount(event.target.value))} value={amount} />
        <Label htmlFor="currency">Convert to:</Label>
        <CurrencySelect name="currency" onChange={setCurrency} />
      </form>

      <Output>
        {
          (status === 'success' && !!data) && <CurrencyOutput amount={amount} currency={currency} equalsTo={convertedAmount(currency)} />
        }
        { (status !== 'success' || !!error ) && <AILoading /> }
      </Output>

    </>
  )
}
