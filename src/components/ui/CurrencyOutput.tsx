import {CurrencyFormatter} from "../../helpers/currency-formatter.helper";
import styled from "styled-components";

const EqualsSignContainer = styled.div`
  color: #a4a4a4;
`

export function CurrencyOutput(props: { amount: number, currency: string, equalsTo: number }) {
  return (
    <div>
      <div>{ CurrencyFormatter(props.amount, 'CZK') }</div>
      <EqualsSignContainer>=</EqualsSignContainer>
      <div>{ CurrencyFormatter(props.equalsTo, props.currency) }</div>
    </div>
  )
}
