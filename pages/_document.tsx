import { Html, Head, Main, NextScript } from 'next/document'
import { kastelov } from 'utils/fontFamily'
import i18nextConfig from '../next-i18next.config.cjs'

export default function Document({ __NEXT_DATA__ }) {
  const currentLocale = __NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale
  return (
    <Html lang={currentLocale}>
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#262626" />
      </Head>
      <body className={`${kastelov.variable} bg-background font-sans`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
