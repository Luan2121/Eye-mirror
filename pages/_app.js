import { StyleReset } from 'atomize';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron } from '../styletron';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <StyletronProvider value = {styletron}>
      <StyleReset />
      <Component {...pageProps} />
    </StyletronProvider>
  )
}

export default MyApp
