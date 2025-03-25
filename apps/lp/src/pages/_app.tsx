import '../styles/global.css';

import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <GoogleAnalytics trackPageViews />
    <Component {...pageProps} />
  </>
);

export default MyApp;
