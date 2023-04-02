import {Select} from "../base/Select";
import {useCurrentExchangeRate} from "../../services/exchange-rate.service";
import {currencyName} from "../../helpers/currency-naming.helper";
import React, {ChangeEvent} from "react";

type CurrencySelectProps = {
  name: string
  onChange?: (value: string) => void
}

export function CurrencySelect(props: CurrencySelectProps) {
  const {status, data} = useCurrentExchangeRate()

  const onValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.onChange) {
      props.onChange(event.currentTarget.value)
    }
  }

  return (
    <Select name={props.name} id={props.name} onChange={onValueChange}>
      { status === 'success' && data.map(currency =>
        <option value={currency.code} key={currency.code}>{ currencyName(currency.code) }</option>
      ) }
    </Select>
  )
}
