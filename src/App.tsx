import {QueryClient, QueryClientProvider} from "react-query";
import {Content} from "./components/Content";
import {Root} from "./components/base/Root";
import {Footer} from "./components/base/Footer";

export default function App() {

  const client = new QueryClient()

  return (
    <Root className="App">

      <QueryClientProvider client={client}>
        <Content />
      </QueryClientProvider>

      <Footer>
        Created based on requirements from Momence
      </Footer>
    </Root>
  )
}
