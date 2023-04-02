import {CurrencyTable} from "./ui/CurrencyTable";
import {CurrencyCalculator} from "./CurrencyCalculator";
import {Main} from "./base/Main";
import {Strong} from "./base/Strong";
import {Header, LightHeader} from "./base/Header";
import arrow from '../assets/arrow.png'
import {Pointer} from "./ui/Pointer";
import {DarkSection, LightSection} from "./base/Section";

export function Content() {

  return (
    <Main>
      <LightSection>
        <Header>Hello! 👋</Header>
        <p>
          This is AI currency calculator <Strong>CurrencyAI</Strong>. We are using the latest ML technology to convert Czech Koruna
          into several other currencies.
        </p>
        <p>
          Thanks to using state of the art neural networks, we are able to provide you with the most accurate rates.
        </p>
      </LightSection>

      <LightSection>
        <CurrencyCalculator />
        <Pointer />
      </LightSection>

      <DarkSection>
        <LightHeader>Exchange Rates</LightHeader>
        <p>
          Behold, noble patrons of commerce, the wondrous and ever-fluctuating world of exchange rates.
          An intricate tapestry of interconnected currencies, each one vying for its rightful place in the global economic landscape.
        </p>
        <p>
          With every passing moment, the delicate balance of these currencies shifts and sways, creating a mesmerizing spectacle of monetary movement.
          Oh, how the exchange rates dance to the tune of the market's whims, the ebb and flow of supply and demand, the ebullient spirit of innovation, and the tranquil pulse of tradition.
        </p>
        <p>
          Verily, the exchange rates are the heartbeat of the international economy, a testament to the tireless efforts of those who seek to understand and harness their power.
          Gaze upon them, ye seekers of prosperity, and marvel at the sheer magnitude of their influence, for in the exchange rates lies the key to unlocking the door to boundless wealth and prosperity.
        </p>
        <CurrencyTable />
      </DarkSection>
    </Main>
  )
}
