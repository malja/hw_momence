import {ExchangeRateCurrent} from "../../types/exchange-rate-current.type"
import _ from 'lodash'
import {useCurrentExchangeRate} from "../../services/exchange-rate.service";
import {Table} from "../base/Table";
import {AILoading} from "./AILoading";

export function CurrencyTable() {
  const {status, data, error} = useCurrentExchangeRate()

  return (
    <Table>

        <thead>
          <tr>
            <th>Currency</th>
            <th>State</th>
            <th>Rate</th>
          </tr>
        </thead>

        <tbody>
          <>
          { !!data && data.map(currency => {
            return (
              <tr key={currency.code}>
                <td>{ _.capitalize(currency.name) }</td>
                <td>{ currency.countryName }</td>
                <td>{ currency.rate }</td>
              </tr>
            )
          }) }

          { !!error &&
              <tr>
                  <td colSpan={3} className="text-center">There was an error loading data</td>
              </tr>
          }

          { (status === 'loading' || error) &&
            <tr>
              <td colSpan={3}>
                <AILoading />
              </td>
            </tr>
          }
          </>
        </tbody>
      </Table>
  )
}
